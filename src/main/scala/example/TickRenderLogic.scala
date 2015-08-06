package example

import scala.collection.immutable.IndexedSeq
import scala.scalajs.js.JSON

/**
 * Created by Larry on 7/12/15.
 */


/**
 *
 * @param beat
 * @param symbol If < 0, then a tick type such as eighth or sixteenth. Otherwise, the measure number
 */
case class TickMarker(beat: Int, symbol: Int)
object TickMarker{
  val MeasureTick = -1
  val QuarterTick = -2
  val EightTick = -3
  val SixteenthTick = -4
  val ThirtySecondTick = -5
}

class TickRenderLogic(song: Song){

  /**
   * @param measure Last measure before next Meter change
   * @param beat Last beat before next Meter change
   * @param meter Meter that applied until measure/beat
   */
  case class MeasureMarker(measure: Int, beat: Int, meter: Int)

  val MeasureToBeatMap: Vector[Int] = Vector.range(0, song.measures).map(
    measure => getBeatAtMeasure(measure)
  )

  //val BeatToMeasureMap: Map[Int, Int] = MeasureToBeatMap.map(_.swap)

  //goal post (beatNumber, meter up to this point)
  lazy val cumulativeMeasureMarker = getCumulativeMeasureMarker
  val totalBeats = cumulativeMeasureMarker.last.beat

  //lazy val totalBeats = cumulativeMeasureMarker.last.beat

  def getCumulativeMeasureMarker: Vector[MeasureMarker] = {
    val meterChanges = song.meterChanges

    //for the math
    val lastMeterChange = meterChanges.last
    val endCapMeterChange = lastMeterChange.copy(measure = song.measures)
    val balancedMeterChanges = song.meterChanges :+ endCapMeterChange

    //1: difference in measures
    //2: meter that applies during that span
    //3: ending measure number of that span
    val deltaMeasures: Vector[(Int, Int, Int)] = (balancedMeterChanges, balancedMeterChanges drop 1).zipped.map({
      (first, second) => (second.measure - first.measure, first.meter, second.measure)
    })

    deltaMeasures.map{
      var accumulator = 0
      d => {
        val (deltaMeasures, meter, measure) = d
        val deltaBeats = deltaMeasures*meter
        accumulator += deltaBeats
        MeasureMarker(measure, accumulator, meter)
      }
    }
  }

  def getMeasureClosestToBeat(desiredBeat: Int, roundUp: Boolean): Int ={
    //find first measure marker that is greater
    val endPost = cumulativeMeasureMarker.find({
      measureMarker => {
        measureMarker.beat > desiredBeat//beat which is greater
      }
    }).getOrElse(cumulativeMeasureMarker.last)//note, we should always be able to find this

    //we are subtracting so roundUp is subtracting a floor, and vice versa
    val deltaMeasure = if(roundUp){
      (endPost.beat - desiredBeat)/endPost.meter
    } else{
      MyMath.ceil(endPost.beat - desiredBeat,endPost.meter)
    }
    endPost.measure - deltaMeasure
  }

  //TODO: refactor into above
  def getMeasureMarkerBeatContainedIn(beat: Int) = {
    cumulativeMeasureMarker.find({
      measureMarker => {
        measureMarker.beat > beat//beat which is greater
      }
    }).getOrElse(cumulativeMeasureMarker.last)
  }


  def getBeatAtMeasure(measure: Int): Int ={
    //find first measure marker that is greater
    val endPost = cumulativeMeasureMarker.find({
      measureMarker => {
        measureMarker.measure > measure//measure which is greater
      }
    }).getOrElse(cumulativeMeasureMarker.last)//note, we should always be able to find this

    val offsetFromEndPost = (endPost.measure - measure)*endPost.meter
    endPost.beat - offsetFromEndPost
  }

  /**
   *
   * @param startBeat Starting beat at left edge of window
   * @param endBeat Starting beat at right edge of window
   * @return List of tuples with measure numbers and the beats they correspond to
   */
  def getMeasureMarkers(startBeat: Int, endBeat: Int): Seq[(Int, Int)] = {
    if(song.meterChanges.size == 1){
      getMeasureMarkersNoMeterChange(startBeat, endBeat)
    }else {
      val width = endBeat - startBeat
      val firstMeasure = getMeasureClosestToBeat(startBeat, roundUp = true)
      val lastMeasure = getMeasureClosestToBeat(endBeat, roundUp = false)

      val measureInterval = MyMath.ceil(lastMeasure - firstMeasure, PianoRollConfig.MaxMeasureTicksShownInRuler)

      val range: Range = firstMeasure until lastMeasure+measureInterval by measureInterval

      range.map {
        measure => (measure, getBeatAtMeasure(measure))
      }
    }
  }

//  private def getMeasureMarkerIterator(startBeat:Int, endBeat: Int): Iterator[(Int, Int)] = {
//    val firstMeasure = getMeasureClosestToBeat(startBeat, roundUp = true)
//    val lastMeasure = getMeasureClosestToBeat(endBeat, roundUp = false)
//    val measureInterval = MyMath.ceil(lastMeasure - firstMeasure, PianoRollConfig.MaxMeasureTicksShownInRuler)
//
//    for{measure <- Iterator.range(firstMeasure, lastMeasure+1, measureInterval)}
//      yield (measure, getBeatAtMeasure(measure))
//  }

  private def getMeasureMarkersNoMeterChange(startBeat: Int, endBeat: Int): Seq[(Int,Int)] = {//more efficient implementation
    val meter: Int = song.meterChanges.head.meter//only one meter

    val firstMeasure = MyMath.ceil(startBeat,meter)
    val lastMeasure = endBeat/meter
    val measureInterval = MyMath.ceil(lastMeasure - firstMeasure, PianoRollConfig.MaxMeasureTicksShownInRuler)

    val range: Range = firstMeasure until lastMeasure by measureInterval
    range.map{
      measure => (measure, measure * meter)
    }
  }
//
//  /**
//   * Return the symbol at this beat
//   * @param beat
//   * @param everyXMeasure Display every x measure, with x being multiple of 2. i.e., show every 4th measure
//   * @return Positive integer if measure to be displayed, negative integers for symbol types
//   */
//  def getTickSymbol(beat: Int, everyXMeasure: Int): Int = {
//    if(BeatToMeasureMap.contains(beat)){
//      if(BeatToMeasureMap(beat) % everyXMeasure == 0){
//        BeatToMeasureMap(beat)
//      }else{
//        PianoRollRulerRenderLogic.MeasureTick
//      }
//    }else{
//      if(beat % 4 == 0){//quarter note
//        PianoRollRulerRenderLogic.QuarterTick
//      }else if(beat % 2 == 0){
//        PianoRollRulerRenderLogic.EightTick
//      }else{
//        PianoRollRulerRenderLogic.SixteenthTick
//      }
//    }
//  }


  //def getTickPrecision(startBeat: Int, endBeat: Int, numTicks: Int): Int = (endBeat - startBeat)/numTicks%2

//  def getTickMarkers(startBeat: Int, widthBeat: Int, maxTicks: Int, maxMeasures: Int): Iterator[TickMarker] = {
////    val startMeasure = getMeasureClosestToBeat(startBeat, roundUp = true)
////    val endMeasure = getMeasureClosestToBeat(endBeat, roundUp = false)
////    val beatPerTickMult2 = MyMath.ceil(deltaBeat, maxTicks)/2
//
//    val tickSize = MyMath.powerOfTwoAbove(widthBeat/maxTicks)
//    //guess that most songs are 4/4
//    val everyXMeasure = MyMath.powerOfTwoAbove(widthBeat/PianoRollConfig.BeatResolution/maxMeasures)
//
//    if(tickSize <= 4){
//      val range = Iterator.range(startBeat, startBeat + widthBeat + tickSize, tickSize)
//      for{beat <- range}
//        yield TickMarker(beat, getTickSymbol(beat, everyXMeasure))
//    }else{
//      val firstMeasure = getMeasureClosestToBeat(startBeat, roundUp = true)
//      val lastMeasure = getMeasureClosestToBeat(startBeat + widthBeat, roundUp = false)
//      val stepSize = MyMath.ceil(lastMeasure - firstMeasure, maxTicks)
//
////      Logger.debug(s"$stepSize, $lastMeasure, $firstMeasure", this.getClass)
//
//      val range = Iterator.range(firstMeasure/everyXMeasure*everyXMeasure,lastMeasure, stepSize)
//
//      for{measure <- range}
//        yield TickMarker(getBeatAtMeasure(measure),
//          if(measure % everyXMeasure == 0) measure else PianoRollRulerRenderLogic.MeasureTick)
//    }
//  }

//  def getTickMarkersByMeasure(startMeasure: Int, widthBeat: Int, maxTicks: Int, maxMeasures:Int):Iterator[TickMarker] = {
//    getTickMarkersByMeasure(MeasureToBeatMap.getOrElse(startMeasure, 0), widthBeat, maxTicks, maxMeasures)
//  }

  /**
   *
   * @param startBeat Start beat of the window
   * @param widthBeat
   * @param maxTicksPerWindow Maximum number of ticks that should actually be drawn
   * @param subdivideMeasuresThresh Number above which don't attempt to subdivide measures
   * @return Iterator of TickMarkers, which specify a certain tick to display at a certain beat
   */
  def getTickMarkers(startBeat: Int, widthBeat: Int,
                     maxTicksPerWindow: Int = 100, subdivideMeasuresThresh: Int = 30): Iterator[TickMarker] = {
    val startMeasure = getMeasureClosestToBeat(startBeat, roundUp = false)
    val endBeat = startBeat + widthBeat//noninclusive
    val endMeasure = getMeasureClosestToBeat(endBeat, roundUp = false)

    val widthMeasures = endMeasure - startMeasure

    if(widthBeat > PianoRollConfig.BeatResolution * 30){//only display measure, don't bother with others
      val stepSize = MyMath.ceil(widthMeasures, 30)
      val adjustedStartMeasure = startMeasure/stepSize*stepSize
      val adjustedStartMeasureV2 =
        if(MeasureToBeatMap(adjustedStartMeasure) < startBeat) adjustedStartMeasure + stepSize
        else adjustedStartMeasure
      //bound issues, ensure start measure is actually visible
      for {
        measure <- Iterator.range(adjustedStartMeasureV2, endMeasure, stepSize)
      }yield TickMarker(MeasureToBeatMap(measure), measure)
    }else{
      val tickSize = MyMath.powerOfTwoAbove(widthBeat/maxTicksPerWindow)
      for{
        measure <- Iterator.range(startMeasure, endMeasure + 1)
        startBeatOfMeasure = MeasureToBeatMap(measure)
        beat <- Iterator.range(startBeatOfMeasure, MeasureToBeatMap(measure+1), tickSize)
        if beat >= startBeat && beat < endBeat
      } yield {
        TickMarker(beat, if(beat == startBeatOfMeasure) measure else getTickSymbol(beat, startBeatOfMeasure))
      }
    }
  }

  /**
   *
   * @param beat
   * @param startBeatOfMeasure
   * @return
   */
  def getTickSymbol(beat: Int, startBeatOfMeasure: Int): Int ={
    val deltaBeat = beat - startBeatOfMeasure
    if(deltaBeat % PianoRollConfig.BeatsInQuarter == 0){
      TickMarker.QuarterTick
    }else if(deltaBeat % PianoRollConfig.BeatsInEighth == 0){
      TickMarker.EightTick
    }else{
      TickMarker.SixteenthTick
    }
  }

  def nearestSnapBeat(beat: Double, beatsPerQuantize: Double) = {
    val measure = getMeasureClosestToBeat(beat.toInt, roundUp = false)
    val measureStartBeat = getBeatAtMeasure(measure)
    
    val unitsOfQuantize = (beat - measureStartBeat)/beatsPerQuantize
    measureStartBeat + unitsOfQuantize*beatsPerQuantize
  }

}





