package example

import org.scalajs.dom
import org.scalajs.dom.{CanvasRenderingContext2D, html}

import scala.collection.mutable.ArrayBuffer
import scala.scalajs.js.Any

/**
 * Created by Larry on 7/12/15.
 */
class PianoRollRenderer(pRollWorld: PianoRollWorld, canvas: html.Canvas, rect: Rectangle) {

  import PianoRollRenderer._

  val log = new Logger(getClass)

  val menuRect = Rectangle(rect.x, rect.y, rect.width, rect.height/10)
  val rulerRect = Rectangle(rect.x, rect.y+menuRect.height, rect.width, rect.height / 10)
  val gridRect = Rectangle(rect.x, rect.y + rulerRect.height + menuRect.height, rulerRect.width, rect.height - rulerRect.height - menuRect.height)

  //val settings2Rect = Rectangle(100, 100, 200, 200)
//  val toolRect = Rectangle(300, 100, 400, 400)

  val playAreaRect = Rectangle(rulerRect.x, rulerRect.y, rulerRect.width, rulerRect.height + gridRect.height)



  //Setup
  val ctx: CanvasRenderingContext2D = canvas.getContext("2d").asInstanceOf[dom.CanvasRenderingContext2D]

  //val settingsRenderer = new SettingsRenderer(pRollWorld.settings, ctx, settingsRect)
  //val settingsRenderer2 = new SettingsRenderer2(settings2Rect, ctx)
  val menuRenderer = new MenuRenderer(ctx, menuRect, pRollWorld.messageQueue)
  menuRenderer.selectToolExternal(MessageQueue.TOOL_SELECT)//initialize to select

  init()

  //  val pianoRollRulerRenderer : PianoRollRulerRenderer = new PianoRollRulerRenderer(pianoRollContainer, renderer)

  def init() {
    println(s"Setup ${canvas.height}")
    canvas.height = canvas.parentElement.clientHeight
    canvas.width = canvas.parentElement.clientWidth

    ctx.fillStyle = "#f3a342"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = "48px serif"
  }

  def render(rect: Rectangle): Unit = {
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height)

    renderRollHorizontalLines()

    pRollWorld.tickLogic.getTickMarkers(
      pRollWorld.startBeat, pRollWorld.widthBeats
    ).foreach({
      tickMarker => {
        renderRuler(tickMarker)
        renderRollVerticalLines(tickMarker)
      }
    })

    renderNotes()
    //renderSettings()
    renderLocator()

    //settingsRenderer2.draw()
    menuRenderer.draw()

  }

  Logger.debug(rect.toString, getClass)

  Logger.debug(rulerRect.toString, getClass)

  def renderRuler(tickMarker: TickMarker): Unit = {
    val (color, height) = tickMarker.symbol match {
      case TickMarker.QuarterTick => ("#00FF00", rulerRect.height / 2)
      case TickMarker.EightTick => ("#0000FF", rulerRect.height / 3)
      case TickMarker.SixteenthTick => ("#00FFFF", rulerRect.height / 4)
      case _ => ("#66E066", rulerRect.height)
    }
    ctx.strokeStyle = color

    ctx.beginPath()
    val x = (tickMarker.beat - pRollWorld.startBeat).toDouble / pRollWorld.widthBeats * rulerRect.width + rulerRect.x
    ctx.moveTo(x, rulerRect.y)
    ctx.lineTo(x, rulerRect.y + height)
    ctx.stroke()

    ctx.fillStyle = "#000000"
    ctx.font = "12pt Calibri"
    if (tickMarker.symbol > 0) {
      //display measure number
      ctx.fillText((tickMarker.symbol + 1).toString, x, rulerRect.y + rulerRect.height * 4 / 5)
    }
  }

  def renderRollVerticalLines(tickMarker: TickMarker): Unit = {
    val color = tickMarker.symbol match {
      case TickMarker.QuarterTick => "#444444"
      case TickMarker.EightTick => "#888888"
      case TickMarker.SixteenthTick => "#AAAAAA"
      case _ => "#000000"
    }
    ctx.strokeStyle = color

    //vertical
    val x = (tickMarker.beat - pRollWorld.startBeat).toDouble / pRollWorld.widthBeats * gridRect.width + gridRect.x
    ctx.beginPath()
    ctx.moveTo(x, gridRect.y)
    ctx.lineTo(x, gridRect.bottomY)
    ctx.stroke()
  }

  def renderRollHorizontalLines(): Unit = {
    ctx.strokeStyle = PianoRollHorizontalRowColor

    val numberOfNotes: Int = pRollWorld.rollRange
    val stepSize: Int = MyMath.ceil(numberOfNotes, 30)

    Iterator.range(pRollWorld.rollLowNote, pRollWorld.rollLowNote + numberOfNotes).foreach(
      currentNote => {

        val y = heightPercentForNote(currentNote) * gridRect.height + gridRect.y
        if (Note.isBlackNote(currentNote)) {
          ctx.fillStyle = PianoRollAltRowFillColor
          ctx.fillRect(gridRect.x, y, gridRect.width, gridRect.height / numberOfNotes)
        }

        ctx.fillStyle = "#AABBCC"
        ctx.font = "10pt Calibri"
        ctx.fillText(Note.getLetter(currentNote), gridRect.x, y + gridRect.height / numberOfNotes)

        ctx.beginPath()
        ctx.moveTo(gridRect.x, y)
        ctx.lineTo(gridRect.rightX, y)
        ctx.stroke()
      }
    )
  }

  def renderNotes(): Unit = {
    val widthBeats = pRollWorld.widthBeats
    val startBeat = pRollWorld.startBeat
    val endBeat = startBeat + widthBeats - 1

    pRollWorld.tracks.tracks.foreach(track => {
      ctx.fillStyle = track.color
      track.notes.iterator(pRollWorld.startBeat,
        endBeat).foreach(note => {
        renderNote(note)
      })
    })

    ctx.fillStyle = PianoRollEditingNoteColor
    if(pRollWorld.dirtyNote.isDefined){
      renderNote(pRollWorld.dirtyNote.get)
    }
  }

  def renderNote(note: Note): Unit ={
    if(note.midi <= pRollWorld.rollHighNote && note.midi >= pRollWorld.rollHighNote - pRollWorld.rollRange){
      val xStart: Double = (note.beatPosition - pRollWorld.startBeat) / pRollWorld.widthBeats * gridRect.width + gridRect.x
      //val xEnd: Double = (note.endBeat-startBeat)/pianoRollContainer.widthBeats * gridRect.width + gridRect.x
      val xWidth: Double = note.lengthInBeats / pRollWorld.widthBeats * gridRect.width

      val yStart: Double = heightPercentForNote(note.midi) * gridRect.height + gridRect.y
      val yHeight: Double = gridRect.height / pRollWorld.rollRange


      ctx.fillRect(xStart, yStart, xWidth, yHeight)
    }
  }

//  def renderSettings() = {
//    ctx.fillStyle = PianoRollSettingsBackgroundColor
//    //renderer.fillRect(settingsRect.x, settingsRect.y, settingsRect.width, settingsRect.height)
//    settingsRenderer.draw()
//  }

  def renderLocator() = {
    if(MyMath.within(pRollWorld.locatorBeat, pRollWorld.startBeat, pRollWorld.startBeat + pRollWorld.widthBeats)){
      val x = getStartXForNote(pRollWorld.locatorBeat)
      //log(s"Render locator $x")
      ctx.strokeStyle = PianoRollLocatorColor
      ctx.beginPath()
      ctx.moveTo(x, playAreaRect.y)
      ctx.lineTo(x, playAreaRect.bottomY)
      ctx.stroke()
    }
  }


  def heightPercentForNote(midi: Int,
                           rollLow: Int = pRollWorld.rollLowNote,
                           rollRange: Int = pRollWorld.rollRange): Double = {
    (rollRange - (midi - rollLow)).toDouble / rollRange
  }

  def getMidiAndBeatAtMouseClick(x: Double, y: Double) = {
    val rollLow = pRollWorld.rollLowNote
    val rollRange = pRollWorld.rollRange
    val yPercent = 1 - (y - gridRect.y)/gridRect.height
    val midi = Math.ceil(yPercent*rollRange+rollLow).toInt

    val beat = (x - gridRect.x)/gridRect.width * pRollWorld.widthBeats + pRollWorld.startBeat
    (midi, beat)
  }

  def getBeatAtMouseClick(x: Double) = {
    (x - gridRect.x)/gridRect.width * pRollWorld.widthBeats + pRollWorld.startBeat
  }

  //TODO: make this more efficient, only have to search bucket!
  def getNoteAtMouseClick(x: Double, y: Double): Option[(Note, Int)] ={
    val (midi, beat) = getMidiAndBeatAtMouseClick(x, y)

    Logger.debug(s"Midi $midi", getClass)
    Logger.debug(s"Beat $beat", getClass)

    val candidates: ArrayBuffer[(Option[Note], Int)] = pRollWorld.tracks.tracks.zipWithIndex.map({
      case (track, index) => {
        val noteIterator = track.notes.iterator(pRollWorld.startBeat, pRollWorld.startBeat + pRollWorld.widthBeats)

        //append the dirty note if necessary
        val modifiedIterator =
          if(pRollWorld.dirtyNote.isDefined) noteIterator ++ Iterable[Note](pRollWorld.dirtyNote.get) else noteIterator
        (modifiedIterator.find(Note.inNote(midi,beat,_)), index)
      }
    })

    candidates.filter(_._1.isDefined).map {
      case (note, index) => (note.get, index)
    }.headOption
  }

  def getStartXForNote(beat: Double) = {
    (beat-pRollWorld.startBeat)/pRollWorld.widthBeats*gridRect.width + gridRect.x
  }

}

object PianoRollRenderer{
  val GridHorizontalLineThreshold = 50
  val PianoRollAltRowFillColor = "#E3F3F8"
  val PianoRollHorizontalRowColor = "#77FF98"
  val PianoRollNoteColor = "#FFA500"
  val PianoRollEditingNoteColor = "#444444"
  val PianoRollSettingsBackgroundColor = "#D3D3D3"
  val PianoRollLocatorColor = "#33CCFF"
}