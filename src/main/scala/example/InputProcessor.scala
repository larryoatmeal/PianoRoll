package example

/**
 * Created by Larry on 7/11/15.
 */
trait InputProcessor {

  def onMouseDown(x: Double, y: Double)
  def onMouseUp(x: Double, y: Double)
  def onMouseMove(x: Double, y: Double)
  def onDrag(x: Double, y: Double, mouseDownX: Double, mouseDownY: Double)
  def onKey(keyCode: Int)
  def onKeyWithShift(keyCode: Int)

}
