package example

/**
 * Created by Larry on 7/26/15.
 */


class PianoRollNotesRenderLogic(val notes: NotesDataStructure) {

  def getRenderableNotes(startBeat: Int, endBeat: Int, minMidi: Int, maxMidI: Int) ={
    notes.iterator(startBeat, endBeat)
      .filter(note => note.midi >= minMidi && note.midi <= maxMidI)
  }


}
