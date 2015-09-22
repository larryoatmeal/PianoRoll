package example

/**
 * Created by Larry on 9/9/15.
 */
class LinearContainer extends Container{
//
//  var leftMargin = 0.05
//  var rightMargin = 0.05
//  var topMargin = 0.05
//  var bottomMargin = 0.05
//
//  var inBetweenMargin = 0.05

  /**
   * Horizontal layout for now
   * @param renderables
   * @param pW percent width of parent of all children
   * @param pH percent height of parent of all chidlren
   * @param pMargin margin in percent of parent
   */
  def bulkAdd(renderables: Seq[RenderObject], pW: Double, pH: Double, pMargin: Double): Unit ={
    renderables.zipWithIndex.foreach((tuple: (RenderObject, Int)) => {
      val renderable = tuple._1
      val index = tuple._2
      val pX = index * (pW + pMargin)
      val pY = pMargin
      addChild(ChildObject(pX, pY, pW, pH, renderable))
    })
  }

  def bulkAdd(renderables: Seq[RenderObject], pW: Double, pH: Double, pMargin: Double, pXStart: Double): Unit ={
    renderables.zipWithIndex.foreach((tuple: (RenderObject, Int)) => {
      val renderable = tuple._1
      val index = tuple._2
      val pX = pXStart + index * (pW + pMargin)
      val pY = pMargin
      addChild(ChildObject(pX, pY, pW, pH, renderable))
    })
  }



//  def respace(): Unit ={
//    val numberOfChildren = children.size
//
//    val childWidth = 1 - leftMargin - rightMargin - inBetweenMargin * (numberOfChildren - 1)
//    val childHeight = 1 - topMargin - bottomMargin
//
//    val childY = topMargin
//
//    children.zipWithIndex.foreach{
//      case (childObject: ChildObject, i: Int) => {
//        val childX = leftMargin +
//      }
//    }
//  }
}
