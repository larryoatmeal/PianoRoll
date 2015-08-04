package example

/**
 * Created by Larry on 7/11/15.
 */
object MyMath {
  def ceil(a: Int, b: Int): Int = (a + b - 1)/b

  /**
   * Let's say you want to map 0->1 to 0,1,2,3,4
   * Can't just do percent * (start + range) just in case start is equal to 1
   * @param percent
   * @param start
   * @param range
   * @return
   */
  def continuousToDiscrete(percent: Double, start: Int, range: Int): Int ={
    (start + percent*range-0.0000001).toInt//floors it
  }

  def doubleEqual(a: Double, b: Double) = Math.abs(a-b) < 0.0000001

  def powerOfTwoAbove(a: Int) = {
    if(a <= 0){
      1
    }else{
      var x = a
      x = x - 1
      x = x | (x >> 1)
      x = x | (x >> 2)
      x = x | (x >> 4)
      x = x | (x >> 8)
      x = x | (x >> 16)
      x + 1
    }
  }

  def clamp(a: Int, low: Int, high: Int) = a max low min high

}
