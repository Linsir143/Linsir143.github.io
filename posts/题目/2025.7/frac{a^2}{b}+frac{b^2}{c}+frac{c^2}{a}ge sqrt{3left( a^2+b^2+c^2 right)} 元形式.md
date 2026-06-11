### 一个不等式 $n$ 元形式

设变元取正数.

已经知道
$$
\frac{a^2}{b}+\frac{b^2}{c}+\frac{c^2}{a}\ge \sqrt{3\left( a^2+b^2+c^2 \right)}
$$
$$
\frac{a^2}{b}+\frac{b^2}{c}+\frac{c^2}{d}+\frac{d^2}{a}\ge \sqrt{4\left( a^2+b^2+c^2+d^2 \right)}
$$
自然考虑如果以下不等式恒成立 $n$ 的取值
$$
\sum_{i=1}^n{\frac{x_{i}^{2}}{x_{i+1}}}\ge \sqrt{n\sum_{i=1}^n{x_{i}^{2}}}
$$
首先取$x_1=x_2=\cdots =x_{n-3}=12,\left( x_{n-2},x_{n-1},x_n \right) =\left( 93,64,32 \right) $ 得 
$$
\frac{3231498783769}{5101387776}-\frac{167771\!\:n}{3968}\ge 0
$$
于是至少需要 $n\le 14$.

剩下的可以枚举排除.

* $n=14$，反例：$\left( 7,7,5,5,4,4,4,5,7,7,8,9,7,7 \right) $

* $n=13$，反例：$\left( 1,1,3,6,5,4,3,2,2,2,2,2,1 \right) $

* $n=12$，反例：$\left( 1,1,1,1,3,4,3,3,2,1,1,1 \right) $

* $n=11$，反例：$\left( 6,6,6,5,4,3,3,3,3,3,5 \right) $
* $n=10$，反例：$\left( 2,2,4,6,8,8,6,4,3,2 \right) $
* $n=9$，反例：$\left( 7,11,16,18,16,12,9,7,6 \right)  $

对于 $n\le 8$ 不等式是成立的，已经知道 $n=3,n=4$ 有比较好的技巧方法

难点是 $n=5,6,7,8$ ，可作为材料投喂程序.
Doc/program.doc/ChineseSimplified/RealSOS/example_multivar.pdf

### 参考

* https://artofproblemsolving.com/community/c6t243f6h3593654_5var_inequality

* https://www.zhihu.com/question/1918299646217922194
* https://docs.qq.com/pdf/DWU5ncWtJcmp3YXpF?