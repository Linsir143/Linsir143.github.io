### 2025.9.2
https://www.zhihu.com/pin/1945987318373680574
若非负实数 $x_1,x_2,\cdots,x_n$ 满足$\sum\limits_{k=1}^n{x_k}=1,n \ge 3$ ，则
$$
\prod_{k=1}^n{\left( \sum_{i<j,i\ne k,j\ne k}{\left( x_i-x_j \right) ^2} \right)}\le \frac{\left( n-2 \right) ^{2n}}{n^n\left( n-1 \right) ^2}
$$
等号成立时，$n-2$个数取$0$，$2$个数取$\dfrac{1}{2}+\dfrac{1}{2}\sqrt{\dfrac{n^2-5n+8}{n\left( n-1 \right)}},\dfrac{1}{2}-\dfrac{1}{2}\sqrt{\dfrac{n^2-5n+8}{n\left( n-1 \right)}}.$



$n =3 $ 时，
$$
x+y+z=1\Rightarrow \left( x-y \right) ^2\left( y-z \right) ^2\left( z-x \right) ^2\le \frac{1}{108}
$$
$n=4$ 时，
$$
a+b+c+d=1\Rightarrow \prod_{\mathrm{cyc}}{\left[ \left( a-b \right) ^2+\left( b-c \right) ^2+\left( c-a \right) ^2 \right]}\le \frac{1}{9}
$$
$n=5$ 时，
$$
a+b+c+d+e=1\Rightarrow 
\\
\prod_{\mathrm{cyc}}{\left[ (a-b)^2+(a-c)^2+(a-d)^2+(b-c)^2+(b-d)^2+(c-d)^2 \right]}\le \frac{59049}{50000}
$$




$n=3:$  $x\ge y \ge z$，
$$
\left( x-y \right) ^2\left( y-z \right) ^2\left( x-z \right) ^2\le x^2y^2\left( x-y \right) ^2
\\
=\frac{1}{4}2xy\cdot 2xy\cdot \left( x-y \right) ^2\le \frac{1}{4}\left( \frac{2xy+2xy+\left( x-y \right) ^2}{3} \right) ^3=\frac{1}{108}\left( x+y \right) ^6\le \frac{1}{108}
$$


$n=4:$  $a \ge b\ge c \ge d$，
$$
\begin{aligned}
&\left( (a-b)^2+(a-c)^2+(b-c)^2 \right) \left( (a-b)^2+(a-d)^2+(b-d)^2 \right) 
\\
&\left( (a-c)^2+(a-d)^2+(c-d)^2 \right) \left( (b-c)^2+(b-d)^2+(c-d)^2 \right) 
\\
&\le \left( (a-b)^2+a^2+b^2 \right) \left( (a-b)^2+a^2+b^2 \right) \left( a^2-c^2+a^2+c^2-d^2 \right) \left( b^2-c^2+b^2+c^2 \right) 
\\
&\le 16\left( a^2-ab+b^2 \right) ^2a^2b^2=\frac{16}{9}\left[ \left( a^2-ab+b^2 \right) 3ab \right] ^2\le \frac{16}{9}\left[ \left( \frac{\left( a+b \right) ^2}{2} \right) ^2 \right] ^2\le \frac{1}{9}
\end{aligned}
$$
