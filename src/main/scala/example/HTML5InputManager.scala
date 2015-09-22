package example

import org.scalajs.dom
import org.scalajs.dom.html
import org.scalajs.dom.raw.{MouseEvent, CanvasRenderingContext2D}

/**
 * Created by Larry on 7/11/15.
 */
class HTML5InputManager(val canvas: html.Canvas){

  var inputProcessor: InputProcessor = null
  val boundingRect = canvas.getBoundingClientRect()

  //init
  canvas.setAttribute("tabIndex", "0")
  canvas.focus()
  registerEventHandlers()

  def setInputProcessor(inputProcessor: InputProcessor): Unit ={
    this.inputProcessor = inputProcessor
  }

  private def getRelativeX(e: MouseEvent): Double = {
    e.clientX - boundingRect.left
  }
  private def getRelativeY(e: MouseEvent): Double = {
    e.clientY - boundingRect.top
  }

  private def registerEventHandlers(): Unit = {
    Logger.verbose("Registering event handlers", this.getClass)
    canvas.onmousedown = {
      (e: dom.MouseEvent) => {
        if(inputProcessor != null){
          inputProcessor.onMouseDown(getRelativeX(e), getRelativeY(e))
        }
      }
    }

    canvas.onmousemove= {
      (e: dom.MouseEvent) => {
        if(inputProcessor != null){
          inputProcessor.onMouseMove(getRelativeX(e), getRelativeY(e))
        }
      }
    }

    canvas.onmouseup = {
      (e: dom.MouseEvent) => {
        if(inputProcessor != null){
          inputProcessor.onMouseUp(getRelativeX(e), getRelativeY(e))
        }
      }
    }

    canvas.onkeydown = {
      (e: dom.KeyboardEvent) => {
        if(inputProcessor != null){
//          Logger.verbose(s"Key pressed ${e.keyCode}", this.getClass)
          //inputProcessor.onKey(e.key)
          if(e.shiftKey){
            inputProcessor.onKeyWithShift(e.keyCode)
          }else{
            if(e.keyCode == KeyCode.BACKSPACE){//prevent back navigation
              e.preventDefault()
            }
            inputProcessor.onKey(e.keyCode)
          }
        }
      }
    }

    canvas.onmousewheel = {
      (e: dom.MouseEvent) => {
        e.preventDefault()
      }
    }

  }
}
