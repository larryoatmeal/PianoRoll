package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

import scala.collection.mutable.ArrayBuffer

/**
 * Created by Larry on 7/25/15.
 */

/**
 *
 * @param pX location of x coordinate in percent of parent's width
 * @param pY
 * @param pW
 * @param pH
 * @param renderObject
 */
case class ChildObject(var pX: Double, var pY: Double, var pW: Double, var pH: Double, renderObject: RenderObject){
  /**
   *
   * @param pX Percent x clicked in parent
   * @param pY Percent y clicked in parent
   * @return Whether this child object was clicked
   */
  def containsPoint(pX: Double, pY: Double) = pX >= this.pX && pX <= this.pX + this.pW &&
    pY >= this.pY && pY <= this.pY + this.pH
}
//case class ChildObjectFixedSize(var pX: Double, var pY: Double, width: Double, height: Double, renderObject: RenderObject,
//                                onClick: (Double, Double) => Unit = (x, y ) =>{})


class Container() extends RenderObject{

  val log = new Logger(this)

  val children: ArrayBuffer[ChildObject] = new ArrayBuffer[ChildObject]()

  def addChild(childObject: ChildObject): Unit = {
    children.append(childObject)
  }

//  /**
//   *
//   * @param renderObject
//   * @param pX percent x coordinate in parent
//   * @param pY percent y coordinate in parent
//   * @param width real width
//   * @param height real height
//   */
//  def addChild(renderObject: RenderObject, pX: Double, pY: Double, width: Double, height: Double): Unit = {
//    children.append(ChildObject(pX, pY, width/this.w, ))
//  }

  def removeAllChildren(): Unit = {
    children.clear()
  }

  override def draw(x: Double, y: Double, width: Double, height: Double, ctx: CanvasRenderingContext2D): Unit = {
    children.foreach(child => {
      val nX = child.pX*width + x
      val nY = child.pY*height + y
      val nW = child.pW*width
      val nH = child.pH*height
      child.renderObject.render(nX, nY, nW, nH, ctx)
    })

    //ctx.rect(x, y, width, height)
    ctx.stroke()
  }

  override def onClick(x: Double, y: Double): Unit = {

//    val pX = (x - this.x)/this.w
//    val pY = (y - this.y)/this.h

    for(
      child <- children
//      if child.renderObject.containsPoint(x, y)
    ) child.renderObject.probeClick(x, y)
  }

  def copy(): Container ={
    val copyContainer = new Container()
    children.foreach{copyContainer.addChild}
    copyContainer
  }
}
