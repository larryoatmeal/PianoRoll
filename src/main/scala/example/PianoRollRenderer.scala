package example

import org.scalajs.dom
import org.scalajs.dom.{CanvasRenderingContext2D, html}

import scala.scalajs.js.Any

/**
 * Created by Larry on 7/12/15.
 */
class PianoRollRenderer(pRollCtrl: PianoRollContainer, canvas: html.Canvas, rect: Rectangle) {

  import PianoRollRenderer._

  //Setup
  val renderer: CanvasRenderingContext2D = canvas.getContext("2d").asInstanceOf[dom.CanvasRenderingContext2D]
  init()

  //  val pianoRollRulerRenderer : PianoRollRulerRenderer = new PianoRollRulerRenderer(pianoRollContainer, renderer)

  def init() {
    println(s"Setup ${canvas.height}")
    canvas.height = canvas.parentElement.clientHeight
    canvas.width = canvas.parentElement.clientWidth

    renderer.fillStyle = "#f3a342"
    renderer.fillRect(0, 0, canvas.width, canvas.height)
    renderer.font = "48px serif"
  }

  def render(rect: Rectangle): Unit = {
    renderer.clearRect(rect.x, rect.y, rect.width, rect.height)

    renderRollHorizontalLines()

    pRollCtrl.tickLogic.getTickMarkers(
      pRollCtrl.startBeat, pRollCtrl.widthBeats
    ).foreach({
      tickMarker => {
        renderRuler(tickMarker)
        renderRollVerticalLines(tickMarker)
      }
    })

    renderNotes()

  }

  val rulerRect = Rectangle(rect.x, rect.y, rect.width, rect.height / 10)
  val gridRect = Rectangle(rect.x, rect.y + rulerRect.height, rulerRect.width, rect.height - rulerRect.height)

  Logger.debug(rect.toString, getClass)

  Logger.debug(rulerRect.toString, getClass)

  def renderRuler(tickMarker: TickMarker): Unit = {
    val (color, height) = tickMarker.symbol match {
      case TickMarker.QuarterTick => ("#00FF00", rulerRect.height / 2)
      case TickMarker.EightTick => ("#0000FF", rulerRect.height / 3)
      case TickMarker.SixteenthTick => ("#00FFFF", rulerRect.height / 4)
      case _ => ("#66E066", rulerRect.height)
    }
    renderer.strokeStyle = color

    renderer.beginPath()
    val x = (tickMarker.beat - pRollCtrl.startBeat).toDouble / pRollCtrl.widthBeats * rulerRect.width + rulerRect.x
    renderer.moveTo(x, rulerRect.y)
    renderer.lineTo(x, rulerRect.y + height)
    renderer.stroke()

    renderer.fillStyle = "#000000"
    renderer.font = "12pt Calibri"
    if (tickMarker.symbol > 0) {
      //display measure number
      renderer.fillText((tickMarker.symbol + 1).toString, x, rulerRect.y + rulerRect.height * 4 / 5)
    }
  }

  def renderRollVerticalLines(tickMarker: TickMarker): Unit = {
    val color = tickMarker.symbol match {
      case TickMarker.QuarterTick => "#444444"
      case TickMarker.EightTick => "#888888"
      case TickMarker.SixteenthTick => "#AAAAAA"
      case _ => "#000000"
    }
    renderer.strokeStyle = color

    //vertical
    val x = (tickMarker.beat - pRollCtrl.startBeat).toDouble / pRollCtrl.widthBeats * gridRect.width + gridRect.x
    renderer.beginPath()
    renderer.moveTo(x, gridRect.y)
    renderer.lineTo(x, gridRect.bottomY)
    renderer.stroke()
  }

  def renderRollHorizontalLines(): Unit = {

    renderer.strokeStyle = PianoRollHorizontalRowColor

    val numberOfNotes: Int = pRollCtrl.rollRange
    val stepSize: Int = MyMath.ceil(numberOfNotes, 30)

    Iterator.range(pRollCtrl.rollLowNote, pRollCtrl.rollLowNote + numberOfNotes, stepSize).foreach(
      currentNote => {

        val y = heightPercentForNote(currentNote) * gridRect.height + gridRect.y
        if (Note.isBlackNote(currentNote)) {
          //            Logger.verbose(n.toString, getClass)
          renderer.fillStyle = PianoRollAltRowFillColor
          renderer.fillRect(gridRect.x, y, gridRect.width, gridRect.height / numberOfNotes)
        }
        // val currentNote = pianoRollContainer.rollRange + pianoRollContainer.rollLowNote - n - 1

        renderer.fillStyle = "#AABBCC"
        renderer.font = "10pt Calibri"
        renderer.fillText(Note.getLetter(currentNote), gridRect.x, y)

        renderer.beginPath()
        renderer.moveTo(gridRect.x, y)
        renderer.lineTo(gridRect.rightX, y)
        renderer.stroke()
      }
    )
  }

  def renderNotes(): Unit = {
    val widthBeats = pRollCtrl.widthBeats
    val startBeat = pRollCtrl.startBeat
    val endBeat = startBeat + widthBeats - 1

    renderer.fillStyle = PianoRollNoteColor
    pRollCtrl.notes.iterator(pRollCtrl.startBeat,
      endBeat).foreach(note => {

//      if(note.midi <= pRollCtrl.rollHighNote && note.midi >= pRollCtrl.rollHighNote - pRollCtrl.rollRange){
//        val xStart: Double = (note.beatPosition - startBeat) / pRollCtrl.widthBeats * gridRect.width + gridRect.x
//        //val xEnd: Double = (note.endBeat-startBeat)/pianoRollContainer.widthBeats * gridRect.width + gridRect.x
//        val xWidth: Double = note.lengthInBeats / pRollCtrl.widthBeats * gridRect.width
//
//        val yStart: Double = heightPercentForNote(note.midi) * gridRect.height + gridRect.y
//        val yHeight: Double = gridRect.height / pRollCtrl.rollRange
//
//        renderer.fillStyle = PianoRollNoteColor
//        renderer.fillRect(xStart, yStart, xWidth, yHeight)
//      }
      renderNote(note)
    })

    renderer.fillStyle = PianoRollEditingNoteColor

    if(pRollCtrl.dirtyNote.isDefined){
      renderNote(pRollCtrl.dirtyNote.get)
    }

  }

  def renderNote(note: Note): Unit ={
    if(note.midi <= pRollCtrl.rollHighNote && note.midi >= pRollCtrl.rollHighNote - pRollCtrl.rollRange){
      val xStart: Double = (note.beatPosition - pRollCtrl.startBeat) / pRollCtrl.widthBeats * gridRect.width + gridRect.x
      //val xEnd: Double = (note.endBeat-startBeat)/pianoRollContainer.widthBeats * gridRect.width + gridRect.x
      val xWidth: Double = note.lengthInBeats / pRollCtrl.widthBeats * gridRect.width

      val yStart: Double = heightPercentForNote(note.midi) * gridRect.height + gridRect.y
      val yHeight: Double = gridRect.height / pRollCtrl.rollRange


      renderer.fillRect(xStart, yStart, xWidth, yHeight)
    }
  }





  def heightPercentForNote(midi: Int,
                           rollLow: Int = pRollCtrl.rollLowNote,
                           rollRange: Int = pRollCtrl.rollRange): Double = {
    (rollRange - (midi - rollLow)).toDouble / rollRange
  }


  def getMidiAndBeatAtMouseClick(x: Double, y: Double) = {
    val rollLow = pRollCtrl.rollLowNote
    val rollRange = pRollCtrl.rollRange
    val yPercent = 1 - (y - gridRect.y)/gridRect.height
    val midi = Math.ceil(yPercent*rollRange+rollLow).toInt

    val beat = (x - gridRect.x)/gridRect.width * pRollCtrl.widthBeats + pRollCtrl.startBeat
    (midi, beat)
  }

  def getNoteAtMouseClick(x: Double, y: Double): Option[Note] ={
//    val rollLow = pRollCtrl.rollLowNote
//    val rollRange = pRollCtrl.rollRange
//    val yPercent = 1 - (y - gridRect.y)/gridRect.height
//    val midi = Math.ceil(yPercent*rollRange+rollLow).toInt
//
//    val beat = (x - gridRect.x)/gridRect.width * pRollCtrl.widthBeats + pRollCtrl.startBeat
    val (midi, beat) = getMidiAndBeatAtMouseClick(x, y)

    Logger.debug(s"Midi $midi", getClass)
    Logger.debug(s"Beat $beat", getClass)

    val noteIterator = pRollCtrl.notes.iterator(pRollCtrl.startBeat, pRollCtrl.startBeat + pRollCtrl.widthBeats)

    //append the dirty note if necessary
    val modifiedIterator =
      if(pRollCtrl.dirtyNote.isDefined) noteIterator ++ Iterable[Note](pRollCtrl.dirtyNote.get) else noteIterator

    modifiedIterator.find(Note.inNote(midi,beat,_))

  }


}
object PianoRollRenderer{
  val GridHorizontalLineThreshold = 50
  val PianoRollAltRowFillColor = "#E3F3F8"
  val PianoRollHorizontalRowColor = "#77FF98"
  val PianoRollNoteColor = "#FFA500"
  val PianoRollEditingNoteColor = "#890034"
}