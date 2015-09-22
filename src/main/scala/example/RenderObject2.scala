package example

import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 9/11/15.
 */
abstract class RenderObject2 {

  var x = 0
  var y = 0
  var w = 100
  var h = 100

  def draw(ctx: CanvasRenderingContext2D)


}
