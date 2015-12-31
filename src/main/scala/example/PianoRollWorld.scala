package example

import scala.collection.mutable

/**
 * Created by Larry on 7/11/15.
 */
class PianoRollWorld(val song: Song) {

  var dirtyNote: Option[Note] = None
  var locatorBeat: Double = 0.0

  var startBeat: Int = 0
  var widthBeats: Int = 100
  val maxTicks: Int = 100
  val maxMeasures: Int = maxTicks/10
  var startMeasure: Int = 0

  var rollLowNote: Int = 50
  var rollRange: Int = 40

  val settings = new PianoRollSettings()
  val messageQueue = new MessageQueue()

  def rollHighNote: Int = rollLowNote + rollRange

  //val notes = new mutable.TreeSet[Note]()(Note.orderingByStart)
  val tracks: TrackDataStructure = TrackDataStructure.getDefaultTracks(song.measures * PianoRollConfig.BeatResolution)


//  val notes = new NotesDataStructure(song.measures * PianoRollConfig.BeatResolution, song.initNotes)
  val tickLogic = new TickRenderLogic(song)

  val STEP_RATIO = 20

  def endBeat = startBeat + widthBeats

  def addNote(note: Note): Unit ={
//    Logger.verbose(s"Adding $note", this.getClass)

    getCurrentTrack.notes.add(note)
    //notes.logStructure()
  }

  def getCurrentTrack: Track = {
    tracks.getCurrentTrack
  }

  def deleteNote(note: Note): Unit = {
//    Logger.verbose(s"Deleting $note", this.getClass)
    getCurrentTrack.notes.delete(note)
  }

  def trackSelected(num: Int): Unit ={
    tracks.setTrack(num)
  }
  def isTrackActive(num: Int) = tracks.currentTrackIndex == num

  def shiftBeat(right: Boolean, division: Int = STEP_RATIO) ={
    val magnitude = MyMath.ceil(widthBeats, division)
    val deltaBeat = if(right) magnitude else -magnitude

    startBeat = MyMath.clamp(startBeat + deltaBeat, 0, song.totalBeats - widthBeats)
//    startBeat = (startBeat + deltaBeat).max(0).min(pianoRollRuler.totalBeats - widthBeats)
//    Logger.verbose(s"Start beat $startBeat", this.getClass)
  }

  def safeSetBeat(beat: Double)={
    startBeat = Math.min(beat, song.totalBeats - widthBeats).toInt
  }

  def zoomIn(factor: Double) = {
    widthBeats = (widthBeats / factor).max(PianoRollConfig.BeatResolution).toInt
  }

  def zoomOut(factor: Double) = {
    widthBeats = (widthBeats * factor).min(song.totalBeats-startBeat).toInt
  }

  //TODO: move these
  private val maxNote = 127
  private val minNote = 0
  private val minRollRange = 6

  def shiftRoll(up: Boolean, division: Int = 20) = {
    val magnitude = MyMath.ceil(rollRange,division)
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


