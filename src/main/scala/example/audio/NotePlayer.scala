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
class NotePlayer(pianoRollContainer: PianoRollContainer) {
  val song = pianoRollContainer.song
  val notes = pianoRollContainer.notes

  val log = new Logger(this)
  val synth = new Synth()

  var songStartPositionTime: Double = 0
  var absStartTime: Double = 0
  //to give some time before playing actually starts so methods can finish
  val StartOffsetTime: Double = 1

  var noteIterator: Iterator[(Note,Double)] = null

  //var noteArray: Vector[(Note, Double)]

  //so we can read note iterator without losing
  //After first play should not be null
  var noteIteratorDirty: (Note, Double) = null


  val IntervalTimeMs = 25
  val LookAheadSeconds = 0.1

  var intervalHandle: Int = -1

  def prepare(): Unit ={
    notes.sort()
  }

  def setPlayPoint(beat: Double, absTime: Double): Unit ={
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
      playNote(noteIteratorDirty._1, noteIteratorDirty._2)
      //stop()
    }else{
      while(noteIterator.hasNext &&
          AudioManager.audio.currentTime + LookAheadSeconds
          > absStartTime + noteIteratorDirty._2 - songStartPositionTime){
        playNote(noteIteratorDirty._1, absStartTime + noteIteratorDirty._2 - songStartPositionTime)
        noteIteratorDirty = noteIterator.next()
      }
    }

    pianoRollContainer.locatorBeat = NoteTimeCalculator.getBeatOfTime(AudioManager.audio.currentTime - absStartTime, song)

    if(pianoRollContainer.locatorBeat > song.totalBeats){
      stop()
      pianoRollContainer.locatorBeat = 0.0
    }
  }

  def stop(): Unit ={
    log("Stopping interval handle")
    if(intervalHandle != -1) dom.clearInterval(intervalHandle)
  }

  def playNote(note: Note, time: Double): Unit ={
    synth.play(note, time)
    synth.stop(NoteTimeCalculator.getTimeOfBeat(note.endBeat, song) - songStartPositionTime + absStartTime)
  }

}
