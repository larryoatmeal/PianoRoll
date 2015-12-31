package example.audio

import example._
import org.scalajs.dom

import scala.collection.mutable.ArrayBuffer
import scala.scalajs.js


/**
 * Created by Larry on 8/8/15.
 *
 * Mutable hell
 * Basically each time play position set to a different location beyond normal playback,
 * a new iterator is obtained and we iterate through that iterator, playing the notes
 */
class NotePlayer(pRollWorld: PianoRollWorld) {
  val song = pRollWorld.song
  var tracks = pRollWorld.tracks.tracks
  val log = new Logger(this)
  val synth = new Synth()
  val playerListeners = new ArrayBuffer[PlayerListener]()

  var songStartPositionTime: Double = 0
  var absStartTime: Double = 0
  //to give some time before playing actually starts so methods can finish
  val StartOffsetTime: Double = 0.01

//  var noteIterator: Iterator[(Note,Double)] = null

  //var noteArray: Vector[(Note, Double)]


  var trackPlayers: ArrayBuffer[(Int, IteratorWithPeek[(Note, Double)])] = null

  //so we can read note iterator without losing notes
  var dirtyNote: (Note, Double) = null


  val IntervalTimeMs = 50
  val LookAheadSeconds = 0.1

  val g = js.Dynamic.global

  var intervalHandle: Int = -1

  def prepare(): Unit ={
    tracks.foreach{
      track => track.notes.sort()
    }
  }

  class IteratorWithPeek[T](val iterator: Iterator[T], val nullHolder: T){
    var dirty = nullHolder

    if(iterator.hasNext){
      dirty = iterator.next()
    }
    //only call after hasNext
    def peek() ={
      dirty
    }
    def hasNext ={
      dirty != nullHolder
    }
    //only call after hasNext
    def pop() = {
      val temp = dirty
      if(iterator.hasNext){
        dirty = iterator.next()
      }else{//we're empty for next round
        dirty = nullHolder
      }
      temp
    }
  }








  def setPlayPoint(beat: Double, absTime: Double): Unit ={
    stop()//to reset
    absStartTime = absTime + StartOffsetTime
    songStartPositionTime = NoteTimeCalculator.getTimeOfBeat(beat, song)
    log(s"Songstartposition $songStartPositionTime")

    val trackPlayer: ArrayBuffer[(Int, IteratorWithPeek[(Note, Double)])] = tracks.zipWithIndex.map{
      case (track, index) => {
       (index, new IteratorWithPeek(NoteTimeCalculator.iterator(beat, song, track.notes), null))
      }}
    trackPlayers = trackPlayer



    intervalHandle = dom.setInterval(playNotes _, IntervalTimeMs)

//    tracks.foreach(track => {
//      //must sort first
//      noteIterator = NoteTimeCalculator.iterator(beat, song, track.notes)
//      //only attempt to play if not empty
//      if(noteIterator.hasNext){
//        dirtyNote = noteIterator.next()
//        intervalHandle = dom.setInterval(scheduleNextBatch _, IntervalTimeMs)
//      }
//    })
  }

  def playNotes(): Unit = {
    //songTimes are the times relative to the beginning of the the song
    val startSongTimeInThisInterval = AudioManager.audio.currentTime - absStartTime + songStartPositionTime
    val endSongTimeInThisInterval = startSongTimeInThisInterval + LookAheadSeconds
    //notify listeners where the playback currenty is
    val beat = NoteTimeCalculator.getBeatOfTime(startSongTimeInThisInterval, song)
    playerListeners.foreach{
      listener: PlayerListener => listener.onBeatChanged(beat)
    }
    if(pRollWorld.locatorBeat > song.totalBeats){
      stop()
      playerListeners.foreach(_.onEnd())
    }
    trackPlayers.foreach{
      case (track, notes) => {
        while(notes.hasNext && notes.peek()._2 < endSongTimeInThisInterval){//play in this
          val (note, timeInSong) = notes.pop()
//          Logger.debug(s"Playing note ${(note, timeInSong)}", getClass)
          val timeToPlay = absStartTime + timeInSong - songStartPositionTime
          playNote(note, timeToPlay, track)
        }
      }
    }
  }
//  def scheduleNextBatch(): Unit ={
//    if(noteIterator.isEmpty){
//      //the very last dirty is not captured by the while loop
//      if(dirtyNote != null) {
//        playNote(dirtyNote._1, absStartTime + dirtyNote._2 - songStartPositionTime)
//        dirtyNote = null
//      }
//    }else{
//      while(noteIterator.hasNext &&
//          AudioManager.audio.currentTime + LookAheadSeconds
//          > absStartTime + dirtyNote._2 - songStartPositionTime){
//        playNote(dirtyNote._1, absStartTime + dirtyNote._2 - songStartPositionTime)
//        dirtyNote = noteIterator.next()
//      }
//    }
//
//    val beat = NoteTimeCalculator.getBeatOfTime(AudioManager.audio.currentTime - absStartTime + songStartPositionTime, song)
//
//    if(pRollWorld.locatorBeat > song.totalBeats){
//      stop()
//      playerListeners.foreach(_.onEnd())
//    }
//
//    playerListeners.foreach{
//      listener: PlayerListener => listener.onBeatChanged(beat)
//    }
//  }

  def stop(): Unit ={
    log("Stopping interval handle")
    if(intervalHandle != -1) dom.clearInterval(intervalHandle)
    intervalHandle = - 1
//    g.stopAll()
    //synth.stop(AudioManager.audio.currentTime)
    synth.stopAll()
  }


  def beatToPlayTime(beat: Double): Unit ={
    NoteTimeCalculator.getTimeOfBeat(beat, song) - songStartPositionTime + absStartTime
  }

  def playNote(note: Note, time: Double, channel: Int): Unit ={
    val endTime = NoteTimeCalculator.getTimeOfBeat(note.endBeat, song) - songStartPositionTime + absStartTime
//    g.playNote(channel, note.midi, time - AudioManager.audio.currentTime, endTime - AudioManager.audio.currentTime )
    synth.playNote(channel, note, time, endTime )
    //    synth.polyphonicPlay(note, time, endTime)
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
