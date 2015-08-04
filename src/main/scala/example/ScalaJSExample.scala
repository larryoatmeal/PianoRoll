package example

import org.scalajs.dom

import scala.scalajs.js.annotation.JSExport
import org.scalajs.dom.html


@JSExport
object ScalaJSExample {

  //These are basically vals, but need canvas first :(
  var inputManager: HTML5InputManager = null
  var container: PianoRollContainer = null
  var controller: PianoRollController = null
  var renderer: PianoRollRenderer = null
  var pianoRollBounds: Rectangle = null

  @JSExport
  def main(canvas: html.Canvas): Unit = {

    inputManager = new HTML5InputManager(canvas)
    container = new PianoRollContainer()

    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight

    pianoRollBounds = new Rectangle(0, 0, canvas.width, canvas.height)
    renderer = new PianoRollRenderer(container, canvas, pianoRollBounds)
    controller = new PianoRollController(container, renderer)
    inputManager.setInputProcessor(controller)

    ConfigColors.load()

    dom.setInterval(render _, 60)

  }


  def render() ={
    renderer.render(pianoRollBounds)
  }

}
