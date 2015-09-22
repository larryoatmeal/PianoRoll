package example

import org.scalajs.dom.raw.{CanvasRenderingContext2D, Event}

/**
 * Created by Larry on 9/11/15.
 */
class SmartImage2(src: String) extends RenderObject2{

  val log = new Logger(this)
  var maintainRatio = true
  val img = new Image()

  var loaded = false
  img.src = src

  img.addEventListener("load", {
    e: Event => {
      loaded = true
    }}
  )
  override def draw(ctx: CanvasRenderingContext2D): Unit = {
    if(loaded){
      if(maintainRatio){
        val scale = w / img.width

        ctx.drawImage(img, x, y, w, img.height * scale)
      }
      else{
        ctx.drawImage(img, x, y, w, h)
      }

    }else{
      ctx.fillText("Loading", x, y)
    }
  }
}
