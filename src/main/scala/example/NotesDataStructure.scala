package example

import scala.collection.mutable.ArrayBuffer


/**
 * Created by Larry on 7/11/15.
 *
 * A list of lists
 * Bucketing technique
 * We want to maintain a sorted list, but rather than keeping a huge list sorted,
 * we break it up into buckets.
 * 2 measures seems to be a good bucket side. Probably average 16 notes maybe,
 * which is manageable to sort
 */
class NotesDataStructure(totalBeats: Int, initialNotes: Vector[Note] = Vector[Note]()){

  val log = new Logger(this.getClass)
  //2 measures
  val BeatsPerBucket = PianoRollConfig.BeatResolution * 2

  val numBuckets = MyMath.ceil(totalBeats, BeatsPerBucket) //"ceil"

  val dataStructure: Vector[ArrayBuffer[Note]] = Vector.fill[ArrayBuffer[Note]](numBuckets)(new ArrayBuffer[Note]())

  //init
  initialNotes.foreach{
    note => add(note)
  }

  def add(note: Note): Unit ={
    val bucketIndex = (note.beatPosition/BeatsPerBucket).toInt
    //bucket should not be more than dataStructure.length-1
    dataStructure(bucketIndex).append(note)
    //don't even sort. We'll just look at all elements in a bucket at a time
  }

  def delete(note: Note): Unit = {
    val bucketIndex = (note.beatPosition/BeatsPerBucket).toInt

    val bucket = dataStructure(bucketIndex)
    val index = bucket.indexWhere( Note.isEqual(_, note))//test equality by reference

    if(index != -1){
      bucket.remove(index)
    }else{
      Logger.warn(s"Could not delete note $note", this.getClass)
    }
  }

  def iterateOver(startBeat: Double, endBeat: Double)(f: (Note) => Unit): Unit ={
    val startBucketIndex = (startBeat/BeatsPerBucket).toInt
    val endBucket = (endBeat/BeatsPerBucket).toInt

    var i = startBucketIndex

    //TODO: don't have to check middle buckets
    while(i < endBucket + 1){
      dataStructure(i).foreach(note => {
        if(note.beatPosition < endBeat){//only trigger if less than
          f(note)
        }
      })
      i = i + 1
    }
  }

  def iterator(startBeat: Double, endBeat: Double): Iterator[Note] = {
    val startBucketIndex = (startBeat/BeatsPerBucket).toInt
    val endBucket = (endBeat/BeatsPerBucket).toInt
    Iterator.range(startBucketIndex, endBucket+1)
      .flatMap(bucket => {
        dataStructure(bucket).iterator}
      )
      .filter(note => note.beatPosition >= startBeat && note.beatPosition < endBeat)
  }

  def iteratorStart(startBeat: Double): Iterator[Note] = iterator(startBeat, numBuckets*BeatsPerBucket-1)

  def sort(): Unit ={
    dataStructure.foreach{insertionSort}
  }

  def insertionSort(arrayBuffer: ArrayBuffer[Note]): Unit ={
    val length = arrayBuffer.length
    if(length > 1){
      var i = 1
      while( i < length){
        val candidateNote = arrayBuffer(i)
        var j = i
        while(j > 0 && arrayBuffer(j-1).beatPosition > candidateNote.beatPosition) {
          arrayBuffer(j) = arrayBuffer(j - 1)//shift elements to the right
          j = j -1
        }
        arrayBuffer(j) = candidateNote
        i += 1
      }
    }
  }

  def empty() = {
    dataStructure.foreach{
      case notes: ArrayBuffer[Note] => notes.clear()
    }
  }


  override def toString(): String = {
      dataStructure.map{
        bucket => bucket.map{
          note => note.beatPosition
        } mkString ("[",",","]")
      }mkString (":")
      //dataStructure.toString()
  }

  def logStructure(){
    dataStructure.foreach{
      bucket => {
        val str = bucket.map{
          note => note.beatPosition
        } mkString ("[",",","]")
        Logger.verbose(s"Bkt: $str", this.getClass)
      }
    }
  }


}
