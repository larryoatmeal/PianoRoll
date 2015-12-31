package example

import org.scalajs.dom

import scala.scalajs.js.annotation.JSExport
import org.scalajs.dom.html


@JSExport
object ScalaJSExample {
  val log = new Logger(this.getClass)


  //These are basically vals, but need canvas first :(
  var inputManager: HTML5InputManager = null
  var container: PianoRollWorld = null
  var controller: PianoRollController = null
  var renderer: PianoRollRenderer = null
  var pianoRollBounds: Rectangle = null


  @JSExport
  def main(canvas: html.Canvas): Unit = {

    inputManager = new HTML5InputManager(canvas)
    container = new PianoRollWorld(Song.starterSong)

    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight

    pianoRollBounds = new Rectangle(0, 0, canvas.width, canvas.height)
    renderer = new PianoRollRenderer(container, canvas, pianoRollBounds)

    controller = new PianoRollController(container, renderer)
    inputManager.setInputProcessor(controller)

//    ConfigColors.load()
    dom.requestAnimationFrame(render _)
  }

  var counter = 0
  var prevTimStamp = 0.0
  val frames = 100

  def render(timeStamp: Double): Unit ={
    //FPS recording
    if(counter % frames == 0){
      val elapsedTime = timeStamp - prevTimStamp
      val fps = frames*1000/elapsedTime
//      log(s"FPS $fps")
      counter = 0
      prevTimStamp = timeStamp
    }
    counter = counter + 1

    renderer.render(pianoRollBounds)
    controller.processMessages()
    dom.requestAnimationFrame(render _)
  }



}
