package example

import scala.collection.{mutable, Searching}

/**
 * Created by Larry on 8/8/15.
 */
class NoteTimeCalculator(val song: Song, val notes: NotesDataStructure) {
//
////  notes.iterator()
//
//
//  def iterator(startBeat: Double) = {
//    val bpmIterator = song.cumulativeBpmMarkers.iterator
//    bpmIterator.dropWhile((marker: BPMMarker) => marker.beatEnd < startBeat)
//
//    var currentBPM = bpmIterator.next()
//
//    notes.iteratorStart(startBeat).map(note => {
//      if(note.beatPosition >= currentBPM.beatEnd){
//        currentBPM = bpmIterator.next()
//      }
//      val beatsSinceChange = note.beatPosition - currentBPM.beatStart
//      val timeSinceChange = Song.deltaBeatsToDeltaTime(currentBPM.bpm, beatsSinceChange)
//      (note, timeSinceChange)
//    })
//  }
//
//  def prepare() = {
//    notes.sort()
//  }

}

object NoteTimeCalculator{
  /**
   * This should be called any time the play back position is changed from usual
   * (such as looping or user clicks elsewhere)
   * @param startBeat Start beat from which to play
   * @return
   */
  def iterator(startBeat: Double, song: Song, notes: NotesDataStructure) = {
    val bpmIterator = song.cumulativeBpmMarkers.iterator
    bpmIterator.dropWhile((marker: BPMMarker) => marker.beatEnd < startBeat)

    var currentBPM = bpmIterator.next()

    notes.iteratorStart(startBeat).map(note => {
      if(note.beatPosition >= currentBPM.beatEnd){
        currentBPM = bpmIterator.next()
      }
      val beatsSinceChange = note.beatPosition - currentBPM.beatStart
      val timeSinceChange = deltaBeatsToDeltaTime(currentBPM.bpm, beatsSinceChange)
      (note, timeSinceChange + currentBPM.startTime)
    })
  }

  def getTimeOfBeat(beat: Double, song: Song) = {
    val bpmMarker = song.cumulativeBpmMarkers.find(beat < _.beatEnd).getOrElse(song.cumulativeBpmMarkers.last)
    bpmMarker.startTime + deltaBeatsToDeltaTime(bpmMarker.bpm, beat)
  }

  //TODO: examien this method
  def getBeatOfTime(time: Double, song: Song) = {
    //guaranteed to find
    val index = song.cumulativeBpmMarkers.lastIndexWhere(time > _.startTime)
    if(index != -1) {
      val bpmMarker = song.cumulativeBpmMarkers(index)
      bpmMarker.beatStart + deltaTimeToDeltaBeats(bpmMarker.bpm, time - bpmMarker.startTime)
    }
    else{
      0.0
    }
  }


  def oneShot(startBeat: Double, song: Song, note: NotesDataStructure) = {
    note.iteratorStart(startBeat).map(note => (note, getTimeOfBeat(note.beatPosition,song)))
  }

  //save some division
  val magicFactor = 60.0/PianoRollConfig.BeatsInQuarter
  def deltaBeatsToDeltaTime(bpm: Double, deltaBeat: Double) = deltaBeat / bpm * magicFactor
  def deltaTimeToDeltaBeats(bpm: Double, deltaTime: Double) = deltaTime * bpm / magicFactor


}




