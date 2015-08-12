package example

import scala.collection.mutable

/**
 * Created by Larry on 7/11/15.
 */
class PianoRollContainer {

  var dirtyNote: Option[Note] = None
  var locatorBeat: Double = 0.0

  var startBeat: Int = 0
  var widthBeats: Int = 100
  val maxTicks: Int = 100
  val maxMeasures: Int = maxTicks/10
  var startMeasure: Int = 0

  var rollLowNote: Int = 50
  var rollRange: Int = 40

  def rollHighNote: Int = rollLowNote + rollRange

  //val notes = new mutable.TreeSet[Note]()(Note.orderingByStart)
  val song = Song.demoSong2
  val notes = new NotesDataStructure(song.measures * PianoRollConfig.BeatResolution, song.initNotes)
  val tickLogic = new TickRenderLogic(song)

  val STEP_RATIO = 20

  def addNote(note: Note): Unit ={
//    Logger.verbose(s"Adding $note", this.getClass)
    notes.add(note)
    //notes.logStructure()
  }

  def deleteNote(note: Note): Unit = {
//    Logger.verbose(s"Deleting $note", this.getClass)
    notes.delete(note)
  }

  def shiftBeat(right: Boolean)={
    val magnitude = MyMath.ceil(widthBeats, STEP_RATIO)
    val deltaBeat = if(right) magnitude else -magnitude

    startBeat = MyMath.clamp(startBeat + deltaBeat, 0, song.totalBeats - widthBeats)
//    startBeat = (startBeat + deltaBeat).max(0).min(pianoRollRuler.totalBeats - widthBeats)
//    Logger.verbose(s"Start beat $startBeat", this.getClass)
  }

//  def shiftMeasure(deltaMeasure: Int)={
//    val newMeasure = startMeasure + deltaMeasure
//
//
//    if(pianoRollRuler.getBeatAtMeasure(newMeasure) > pianoRollRuler.totalBeats-widthBeats){
//
//    }
//
//
//    val capMeasure = pianoRollRuler.getMeasureClosestToBeat(pianoRollRuler.totalBeats-widthBeats, roundUp = true)
//    startMeasure = MyMath.clamp(newMeasure, 0, capMeasure)
//    startBeat = pianoRollRuler.getBeatAtMeasure(startMeasure)
//    //    startBeat = (startBeat + deltaBeat).max(0).min(pianoRollRuler.totalBeats - widthBeats)
//    Logger.verbose(s"Start meat $startMeasure", this.getClass)
//  }


  def zoomIn(factor: Double) = {
//    Logger.verbose(s"Zooming in by $factor", this.getClass)
    widthBeats = (widthBeats / factor).max(PianoRollConfig.BeatResolution).toInt
  }

  def zoomOut(factor: Double) = {
//    Logger.verbose(s"Zooming in by $factor", this.getClass)
    widthBeats = (widthBeats * factor).min(song.totalBeats-startBeat).toInt
  }

  //TODO: move these
  private val maxNote = 127
  private val minNote = 0
  private val minRollRange = 6

  def shiftRoll(up: Boolean) = {
    val magnitude = MyMath.ceil(rollRange,20)
    val delta = if(up) magnitude else -magnitude
    rollLowNote = MyMath.clamp(rollLowNote + delta, minNote, maxNote-rollRange)
  }

  def zoomOutRoll(factor: Double) = {
    rollRange = (rollRange * factor).min(maxNote-rollLowNote).toInt
  }

  def zoomInRoll(factor: Double) = {
    rollRange = (rollRange / factor).max(minRollRange).toInt
  }

  def nearestSnapBeat(beat: Double, snapUnit: Double) = tickLogic.nearestSnapBeat(beat, snapUnit)

}


