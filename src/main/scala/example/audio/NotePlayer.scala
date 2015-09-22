package example.audio

import example._
import org.scalajs.dom

import scala.collection.mutable.ArrayBuffer


/**
 * Created by Larry on 8/8/15.
 *
 * Mutable hell
 * Basically each time play position set to a different location beyond normal playback,
 * a new iterator is obtained and we iterate through that iterator, playing the notes
 */
class NotePlayer(pRollWorld: PianoRollWorld) {
  val song = pRollWorld.song
  val notes = pRollWorld.notes

  val log = new Logger(this)
  val synth = new Synth()
  val playerListeners = new ArrayBuffer[PlayerListener]()

  var songStartPositionTime: Double = 0
  var absStartTime: Double = 0
  //to give some time before playing actually starts so methods can finish
  val StartOffsetTime: Double = 0.01

  var noteIterator: Iterator[(Note,Double)] = null

  //var noteArray: Vector[(Note, Double)]

  //so we can read note iterator without losing notes
  var noteIteratorDirty: (Note, Double) = null


  val IntervalTimeMs = 25
  val LookAheadSeconds = 0.1

  var intervalHandle: Int = -1

  def prepare(): Unit ={
    notes.sort()
  }

  def setPlayPoint(beat: Double, absTime: Double): Unit ={
    stop()//to reset

    absStartTime = absTime + StartOffsetTime
    songStartPositionTime = NoteTimeCalculator.getTimeOfBeat(beat, song)
    log(s"Songstartposition $songStartPositionTime")
    //must sort first
    noteIterator = NoteTimeCalculator.iterator(beat, song, notes)

    //only attempt to play if not empty
    if(noteIterator.hasNext){
      noteIteratorDirty = noteIterator.next()
      intervalHandle = dom.setInterval(scheduleNextBatch _, IntervalTimeMs)
    }
  }

  def scheduleNextBatch(): Unit ={
    if(noteIterator.isEmpty){
      //the very last dirty is not captured by the while loop
      if(noteIteratorDirty != null) {
        playNote(noteIteratorDirty._1, absStartTime + noteIteratorDirty._2 - songStartPositionTime)
        noteIteratorDirty = null
      }
    }else{
      while(noteIterator.hasNext &&
          AudioManager.audio.currentTime + LookAheadSeconds
          > absStartTime + noteIteratorDirty._2 - songStartPositionTime){
        playNote(noteIteratorDirty._1, absStartTime + noteIteratorDirty._2 - songStartPositionTime)
        noteIteratorDirty = noteIterator.next()
      }
    }

    val beat = NoteTimeCalculator.getBeatOfTime(AudioManager.audio.currentTime - absStartTime + songStartPositionTime, song)

    if(pRollWorld.locatorBeat > song.totalBeats){
      stop()
      playerListeners.foreach(_.onEnd())
    }

    playerListeners.foreach{
      listener: PlayerListener => listener.onBeatChanged(beat)
    }
  }

  def stop(): Unit ={
    log("Stopping interval handle")
    if(intervalHandle != -1) dom.clearInterval(intervalHandle)
    intervalHandle = - 1
    //synth.stop(AudioManager.audio.currentTime)
    synth.polyphonicStop()
  }

  def playNote(note: Note, time: Double): Unit ={
    synth.polyphonicPlay(note, time, NoteTimeCalculator.getTimeOfBeat(note.endBeat, song) - songStartPositionTime + absStartTime)
    //synth.play(note, time)
    //synth.stop(NoteTimeCalculator.getTimeOfBeat(note.endBeat, song) - songStartPositionTime + absStartTime)
  }

  def registerPlayerListener(playerListener: PlayerListener): Unit ={
    playerListeners.append(playerListener)
  }

  def removePlayerListener(playerListener: PlayerListener): Unit = {
    val index = playerListeners.indexOf(playerListener)
    if (index == -1){
      log.warn(s"Could not remove $playerListener")
    }else{
      playerListeners.remove(index)
    }
  }

  def isPlaying = intervalHandle != -1

}
