package example

/**
 * Created by Larry on 7/11/15.
 */

class Note(val midi: Int, val beatPosition: Double, val lengthInBeats: Double){
  override def toString: String = s"Note(midi: $midi, beatPosition: $beatPosition, lengthInBeats: $lengthInBeats)"
  val endBeat = lengthInBeats + beatPosition
}

object Note{
  val orderingByStart: Ordering[Note] = Ordering.by(note => note.beatPosition)

  val baseMidiToLetterMap = Map(
  0 -> "C",
  1 -> "Db",
  2 -> "D",
  3 -> "Eb",
  4 -> "E",
  5 -> "F",
  6 -> "Gb",
  7 -> "G",
  8 -> "Ab",
  9 -> "A",
  10 -> "Bb",
  11 -> "B"
  )

  val baseMidiBlackNotes = Set(1, 3, 6, 8, 10)

  def getLetter(midi: Int) = baseMidiToLetterMap(midi % 12)

  def isBlackNote(midi: Int) = baseMidiBlackNotes.contains(midi % 12)

  def inNote(midi: Int, beat: Double, note: Note) = {
    midi == note.midi && beat >= note.beatPosition && beat <= note.endBeat
  }

  val floatThresh = 0.000001

  def isEqual(note1: Note, note2: Note): Boolean ={
    note1.midi == note2.midi &&
      MyMath.doubleEqual(note1.beatPosition, note2.beatPosition) &&
      MyMath.doubleEqual(note1.lengthInBeats, note2.lengthInBeats)
  }
}

