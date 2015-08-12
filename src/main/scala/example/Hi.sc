import example.{NoteTimeCalculator, Song, NotesDataStructure}

val song = Song.demoSong2
val notes = song.initNotes
val numBeats = notes.foldLeft(0.0)((maxBeat, note)=>{
  Math.max(maxBeat, note.beatPosition)
})

val data = new NotesDataStructure(numBeats.toInt + 1, notes)

val it = data.iterator(0, numBeats)
it.next()
it.next()
it.next()
it.next()
it.next()
it.next()
it.next()
song.cumulativeBpmMarkers
val calc = new NoteTimeCalculator(song, data)
//calc.prepare()
//calc.iterator(0).foreach(println(_))
data.sort()
NoteTimeCalculator.iterator(0, song, data).foreach(println)
NoteTimeCalculator.oneShot(0, song, data).foreach(println)
