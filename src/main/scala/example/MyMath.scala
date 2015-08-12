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

  def within(x: Double, min: Double, max: Double) = (x >= min) && (x <= max)

  //Look at elements pair by pair and do something
  def pairWiseCompute[A,B](l: Seq[A])(f: (A, A) => B): Seq[B] = {
    (l, l drop 1).zipped.map({
      (first, second) => f(first, second)
    })
  }

  def pairWiseComputeAppend[A,B](l: Seq[A])(f: (A, A) => B): Seq[(A,B)] = {
    pairWiseCompute(l)((first, second) => (second, f(first, second)))
  }

  //Look at elements pair by pair and then accumulate along the way
  def cumulativeDist[A,B](l: Seq[A], initAccum: B)(accumF: (A, B) => B) = {
    l.map{
      var accumulator: B = initAccum
      elem => {
        accumulator = accumF(elem, accumulator)
        accumulator
      }
    }
  }

//  def getCumulativeFencePost[A,B](l: Seq[A], createEndCap: A => A, delta: (A,A) => Double,
//                                  accum: ((A, Double), Double) => B): Seq[B] = {
//    //Add end cap to balance for the deltas
//    val balanced = l :+ createEndCap(l.last)
//
//    //A sequence consisting of tuples of the first element and how long it applied for
//    val deltaMeasures: Seq[(A, Double)] = pairWiseCompute(balanced)((first: A, second: A) =>{
//      (first, delta(first, second))
//    })
//  }




}
