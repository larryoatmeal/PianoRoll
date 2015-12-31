package example

import scala.collection.mutable.ArrayBuffer
import scala.scalajs.js
import scala.util.Random

/**
 * Created by Larry on 7/12/15.
 */

/**
 * @param measures Measures will be zero indexed.
 * @param initNotes Can be empty
 * @param bpmChanges Must be nonempty
 * @param meterChanges Must be nonempty
 */
case class Song(measures: Int, initNotes: Vector[Note], bpmChanges: Vector[BPMChange], meterChanges: Vector[MeterChange]){

  //=================== MEASURE MARKERS =============================================================================
  val MeasureToBeatMap: Vector[Int] = Vector.range(0, measures).map(
    measure => getBeatAtMeasure(measure)
  )
  lazy val cumulativeMeasureMarker: Vector[MeasureMarker] = getCumulativeMeasureMarker
  val totalBeats = cumulativeMeasureMarker.last.beat

  private def getCumulativeMeasureMarker: Vector[MeasureMarker] = {
    //for the math
    val lastMeterChange = meterChanges.last
    val endCapMeterChange = lastMeterChange.copy(measure = measures)
    val balancedMeterChanges = meterChanges :+ endCapMeterChange

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

  private def getBeatAtMeasure(measure: Int): Int ={
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
    if(meterChanges.size == 1){
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

  private def getMeasureMarkersNoMeterChange(startBeat: Int, endBeat: Int): Seq[(Int,Int)] = {//more efficient implementation
    val meter: Int = meterChanges.head.meter//only one meter

    val firstMeasure = MyMath.ceil(startBeat,meter)
    val lastMeasure = endBeat/meter
    val measureInterval = MyMath.ceil(lastMeasure - firstMeasure, PianoRollConfig.MaxMeasureTicksShownInRuler)

    val range: Range = firstMeasure until lastMeasure by measureInterval
    range.map{
      measure => (measure, measure * meter)
    }
  }

  //================== BEAT MARKERS =================================================================================
  private val bpmChangesEndCapped = bpmChanges :+ bpmChanges.last.copy(beat = totalBeats)

  val cumulativeBpmMarkers = MyMath.pairWiseCompute(bpmChangesEndCapped) {
    var totalTime = 0.0
    (change1: BPMChange, change2: BPMChange) => {
      val deltaBeat = change2.beat - change1.beat
      val deltaSeconds = deltaBeat / PianoRollConfig.BeatsInQuarter / change1.bpm * 60.0
      val change1Time = totalTime
      totalTime = totalTime + deltaSeconds
      BPMMarker(change1.beat, change2.beat, change1.bpm, change1Time)
    }
  }

}

object Song{




  val demoOneNumMeasures = 32 * 8
  val demoOneNotes = Vector.range(0, 500).map(_ => randomNote())
//val demoOneNotes = Vector(new Note(60, 0, 16))
  val arpeggio = Vector.range(0, 1600).map(new Note(Random.nextInt(20) + 50, _, 0.5))


  val demoOneBPMChanges = Vector(new BPMChange(0, 180),new BPMChange(120*4, 200),new BPMChange(130*16, 91))
  val demoOneMeterChanges = Vector(new MeterChange(0, PianoRollConfig.BeatResolution))//4/4

  val demoTwoMeterChanges = Vector(MeterChange(0, PianoRollConfig.BeatResolution),MeterChange(2, PianoRollConfig.BeatResolution*3/8),
    MeterChange(4, PianoRollConfig.BeatResolution* 3/4), MeterChange(10, PianoRollConfig.BeatResolution * 2/4),
    MeterChange(25, PianoRollConfig.BeatResolution)
  )//4/4

  val starterSong = Song(200, Vector[Note](), Vector(new BPMChange(0, 120)), Vector(MeterChange(0, PianoRollConfig.BeatResolution)))

  val demoSong = Song(demoOneNumMeasures, arpeggio, Vector(new BPMChange(0, 120)), demoOneMeterChanges)

  val demoSong2 =demoSong

  val g = js.Dynamic.global


  val midterm = g.midterm

  val trackData: Array[Vector[Note]] = midterm.asInstanceOf[js.Array[js.Array[js.Dynamic]]].map{
    track: js.Array[js.Dynamic] => {
      track.map{
        note: js.Dynamic => {
          val midi = note.midi.asInstanceOf[Int]
          val startBeat = note.startBeat.asInstanceOf[Double]
          val duration = note.duration.asInstanceOf[Double]
          new Note(midi, startBeat, duration)
        }
      }.toArray.toVector
    }
  }.toArray

  Logger.debug(trackData.toString, this.getClass)


  def randomNote(): Note = {
    new Note(Random.nextInt(20)+50, Random.nextInt(16 * 200)/4 * 4, 8)
  }

}
