package example

/**
 * Created by Larry on 7/11/15.
 */
trait InputProcessor {

  private var mouseDown = false
  private var mouseDownX = -1.0
  private var mouseDownY = -1.0

  def onMouseDown(x: Double, y: Double): Unit ={
    mouseDown = true
    mouseDownX = x
    mouseDownY = y
  }
  def onMouseUp(x: Double, y: Double): Unit ={
    mouseDown = false
  }
  def onMouseMove(x: Double, y: Double): Unit ={
    if(mouseDown){
      onDrag(x, y, mouseDownX, mouseDownY)
    }
  }
  def onDrag(x: Double, y: Double, mouseDownX: Double, mouseDownY: Double)
  def onKey(keyCode: Int)
  def onKeyWithShift(keyCode: Int)

}
