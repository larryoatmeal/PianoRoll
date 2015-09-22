package example

import org.scalajs.dom.raw.HTMLElement

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/**
 * Created by Larry on 9/10/15.
 *
 * For some reason scalajs.dom Image is not working
 */
@JSName("Image")
class Image extends HTMLElement{
  var src: String = js.native
  var width: Int = js.native
  var height: Int = js.native
}
