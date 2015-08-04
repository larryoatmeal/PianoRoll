package example

/**
 * Created by Larry on 7/25/15.
 */
case class Rectangle(x: Double, y: Double, width: Double, height: Double){


//  def applyX(percentX: Double) = width * percentX + x
//  def applyY(percentY: Double) = height * percentY + y

  val bottomY = height + y
  val rightX = width + x

  def containsPoint(pX: Double, pY: Double) = pX >= x && pX <= rightX && pY >= y && pY <= bottomY

}
