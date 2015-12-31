package example

import scala.collection.mutable.ArrayBuffer

/**
  * Created by Larry Wang on 12/30/2015.
  */
case class Track(notes: NotesDataStructure, name: String, patch: String, color: String)
class TrackDataStructure(totalBeats: Int) {
  //TODO: this class is very unsafe
  val tracks = new ArrayBuffer[Track]()
  var currentTrackIndex = 0

  def newTrack(name: String, patch: String, color: String): Track ={
     Track(new NotesDataStructure(totalBeats), name, patch, color)
  }
  def addTrack(track: Track): Unit ={
    tracks += track
  }
  def createAndAdd(name: String, patch: String, color: String) = {
    addTrack(newTrack(name, patch, color));
  }
  def deleteTrack(track: Track): Unit ={
    tracks -= track
  }
  def setTrack(index: Int): Unit ={
    if(index < tracks.length){
      currentTrackIndex = index
    }else{
      Logger.error(s"Track index $index out of range", this.getClass)
    }
  }

  def getCurrentTrack = tracks(currentTrackIndex)
}
object TrackDataStructure{

  val DEFAULT_COLORS = Vector(
    "#ee4035",
    "#f37736",
    "#fdf498",
    "#7bc043",
    "#0392cf"
  )
  def getDefaultTracks(totalBeats: Int): TrackDataStructure = {
    val trackData = new TrackDataStructure(totalBeats)
    trackData.createAndAdd("Piano", "Acoustic Grand Piano", DEFAULT_COLORS(0))
    trackData.createAndAdd("String", "String Ensemble 1", DEFAULT_COLORS(1))
    trackData.createAndAdd("Brass", "Brass Section", DEFAULT_COLORS(2))
    trackData.createAndAdd("Flute", "Flute", DEFAULT_COLORS(3))
    trackData.createAndAdd("Bass", "Acoustic Bass", DEFAULT_COLORS(4))
    trackData
  }
}
