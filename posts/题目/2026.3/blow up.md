###### 2026.3.18
深层次的东西/原理等可能涉及代数几何，这只是一些简单的应用层面的东西
## Conjecture
需要用到一个**!!#ff3333 猜测：!!**
三元齐次多项式 $f(x,y,z),g(x,y,z)$ 满足$f(x,y,z)g(x,y,z) \ge 0, \forall x,y,z \in \mathbb{R}$ 且两者最大公因式为 $1$. 则 $f(x,y,z) \ge 0 (\lor \le 0), \forall x,y,z \in \mathbb{R}.$ 

<details>
  <summary>  **!!#ff8000 AI说是对的 单击展开!!** </summary>
  ![image](posts/images/AgAABVPZS7iec8hXC-RLRJgPWApHcpUr.png)
</details>

---






## resolution,blow up
欲证 $ F(x,y,z) \ge 0 $, 选取合适的 $f,g,h$，令 
$$X=\frac{f\left( x,y,z \right)}{h\left( x,y,z \right)},Y=\frac{g\left( x,y,z \right)}{h\left( x,y,z \right)}$$
转化为 $G(X,Y) \ge 0.$ 且 $G\left( \dfrac{f\left( x,y,z \right)}{h\left( x,y,z \right)},\dfrac{g\left( x,y,z \right)}{h\left( x,y,z \right)} \right) $ 以 $f(x,y,z)$ 为因子. 且 $G(X,Y) > 0$ 严格正定无取等. 或者选择合适的$f,g,h$可以消去部分取等. 

**注:**
严格正定推出正则，正则不一定严格正定，故 $f,g,h$ 的选取需要使得 $G>0$ 而不仅$G(x,y)=0$正则. 

### 例1

Vasile
$$
F=\left( \sum{x^2} \right) ^2-3\sum{x^3y}\ge 0
$$
不需要 $Y$
取
$$X=
\dfrac{\sum _{\text{cyc}}  \left(2 x^3-7 x^2 z+5 x y z\right)}{\sum _{\text{cyc}}  \left(2 x^2 y-3 x^2 z+x y z\right)}
$$
则
$$
7-4\!\:X+X^2=\frac{4\!\:(x^2-x\!\:y+y^2-x\!\:z-y\!\:z+z^2)F}{(2\!\:x^2\!\:y-3\!\:x\!\:y^2-3\!\:x^2\!\:z+3\!\:x\!\:y\!\:z+2\!\:y^2\!\:z+2\!\:x\!\:z^2-3\!\:y\!\:z^2)^2} >0  \quad 
$$

```
(2 x^3 - 7 x y^2 + 2 y^3 - 7 x^2 z + 15 x y z - 7 y z^2 + 2 z^3)/(
2 x^2 y - 3 x y^2 - 3 x^2 z + 3 x y z + 2 y^2 z + 2 x z^2 - 3 y z^2)
```



### 例2

https://tieba.baidu.com/p/10548019086

1.
$$
F=\sum _{\text{cyc}}  \left(x^2 \left(x-y\right) \left(x-z\right) \left(x-y-z\right)^4\right) \ge 0
$$

无需$Y$
$$
X = \frac{\left( \begin{array}{c}
	x^5-7x^3y^2+11x^2y^3-6xy^4+y^5-6x^4z+9x^3yz-8x^2y^2z+9xy^3z+\\
	11x^3z^2-8x^2yz^2-8xy^2z^2-7y^3z^2-7x^2z^3+9xyz^3+11y^2z^3-6yz^4+z^5\\
\end{array} \right)}{\left( x-y \right) \left( x-z \right) \left( y-z \right) \left( x^2-2xy+y^2-2xz-2yz+z^2 \right)}
$$

$$
12-6\!\:X+X^2=\frac{\left( x^2-x\!\:y+y^2-x\!\:z-y\!\:z+z^2 \right) F}{(x-y)^2\!\:(x-z)^2\!\:(y-z)^2\!\:(x^2-2\!\:x\!\:y+y^2-2\!\:x\!\:z-2\!\:y\!\:z+z^2)^2}
$$

```
{12 - 6*X + X^2, X -> (x^5 - 7*x^3*y^2 + 11*x^2*y^3 - 6*x*y^4 + y^5 - 6*x^4*z + 9*x^3*y*z - 8*x^2*y^2*z + 9*x*y^3*z + 11*x^3*z^2 - 8*x^2*y*z^2 - 8*x*y^2*z^2 - 7*y^3*z^2 - 7*x^2*z^3 + 9*x*y*z^3 + 11*y^2*z^3 - 6*y*z^4 + z^5)/((x - y)*(x - z)*(y - z)*(x^2 - 2*x*y + y^2 - 2*x*z - 2*y*z + z^2))}
```

2.
 $$
 F =
\sum _{\text{cyc}}  \left(x^2 \left(x-y\right) \left(x-z\right) \left(x-y-z\right)^2 \left(y+z\right)^2\right) \ge 0
$$


$$
\begin{cases}
	X=\frac{\left( \begin{array}{c}
	x^4y^2-2x^3y^3+x^2y^4-2x^3y^2z-2x^2y^3z+x^4z^2-2x^3yz^2+12x^2y^2z^2\\
	-2xy^3z^2+y^4z^2-2x^3z^3-2x^2yz^3-2xy^2z^3-2y^3z^3+x^2z^4+y^2z^4\\
\end{array} \right)}{x\left( x-y \right) y\left( x-z \right) \left( y-z \right) z}\\
	Y=\frac{x^3-2x^2y-2xy^2+y^3-2x^2z+9xyz-2y^2z-2xz^2-2yz^2+z^3}{\left( x-y \right) \left( x-z \right) \left( y-z \right)}\\
\end{cases}
$$

$$
720-9\!\:X^2+X^4+108\!\:X\!\:Y+2\!\:X^3\!\:Y+252\!\:Y^2+8\!\:X\!\:Y^3+16\!\:Y^4=\frac{FG}{\left( \cdots \right) ^4}>288>0
$$
且 $\mathrm{gcd}(F,G)=1$

```
PolynomialGCD[x^6*y^2 - 4*x^5*y^3 + 6*x^4*y^4 - 4*x^3*y^5 + x^2*y^6 + 2*x^6*y*z - 8*x^5*y^2*z + 6*x^4*y^3*z + 6*x^3*y^4*z - 8*x^2*y^5*z + 2*x*y^6*z + x^6*z^2 - 8*x^5*y*z^2 + 28*x^4*y^2*z^2 - 26*x^3*y^3*z^2 + 28*x^2*y^4*z^2 - 8*x*y^5*z^2 + y^6*z^2 - 4*x^5*z^3 + 6*x^4*y*z^3 - 26*x^3*y^2*z^3 - 26*x^2*y^3*z^3 + 6*x*y^4*z^3 - 4*y^5*z^3 + 6*x^4*z^4 + 6*x^3*y*z^4 + 28*x^2*y^2*z^4 + 6*x*y^3*z^4 + 6*y^4*z^4 - 4*x^3*z^5 - 8*x^2*y*z^5 - 8*x*y^2*z^5 - 4*y^3*z^5 + x^2*z^6 + 2*x*y*z^6 + y^2*z^6, x^10*y^6 - 4*x^9*y^7 + 6*x^8*y^8 - 4*x^7*y^9 + x^6*y^10 - 8*x^9*y^6*z + 8*x^8*y^7*z + 8*x^7*y^8*z - 8*x^6*y^9*z + 3*x^10*y^4*z^2 - 8*x^9*y^5*z^2 + 77*x^8*y^6*z^2 - 80*x^7*y^7*z^2 + 77*x^6*y^8*z^2 - 8*x^5*y^9*z^2 + 3*x^4*y^10*z^2 + 8*x^10*y^3*z^3 - 60*x^9*y^4*z^3 + 80*x^8*y^5*z^3 - 252*x^7*y^6*z^3 - 252*x^6*y^7*z^3 + 80*x^5*y^8*z^3 - 60*x^4*y^9*z^3 + 8*x^3*y^10*z^3 + 3*x^10*y^2*z^4 - 60*x^9*y^3*z^4 + 346*x^8*y^4*z^4 - 504*x^7*y^5*z^4 + 1790*x^6*y^6*z^4 - 504*x^5*y^7*z^4 + 346*x^4*y^8*z^4 - 60*x^3*y^9*z^4 + 3*x^2*y^10*z^4 - 8*x^9*y^2*z^5 + 80*x^8*y^3*z^5 - 504*x^7*y^4*z^5 - 736*x^6*y^5*z^5 - 736*x^5*y^6*z^5 - 504*x^4*y^7*z^5 + 80*x^3*y^8*z^5 - 8*x^2*y^9*z^5 + x^10*z^6 - 8*x^9*y*z^6 + 77*x^8*y^2*z^6 - 252*x^7*y^3*z^6 + 1790*x^6*y^4*z^6 - 736*x^5*y^5*z^6 + 1790*x^4*y^6*z^6 - 252*x^3*y^7*z^6 + 77*x^2*y^8*z^6 - 8*x*y^9*z^6 + y^10*z^6 - 4*x^9*z^7 + 8*x^8*y*z^7 - 80*x^7*y^2*z^7 - 252*x^6*y^3*z^7 - 504*x^5*y^4*z^7 - 504*x^4*y^5*z^7 - 252*x^3*y^6*z^7 - 80*x^2*y^7*z^7 + 8*x*y^8*z^7 - 4*y^9*z^7 + 6*x^8*z^8 + 8*x^7*y*z^8 + 77*x^6*y^2*z^8 + 80*x^5*y^3*z^8 + 346*x^4*y^4*z^8 + 80*x^3*y^5*z^8 + 77*x^2*y^6*z^8 + 8*x*y^7*z^8 + 6*y^8*z^8 - 4*x^7*z^9 - 8*x^6*y*z^9 - 8*x^5*y^2*z^9 - 60*x^4*y^3*z^9 - 60*x^3*y^4*z^9 - 8*x^2*y^5*z^9 - 8*x*y^6*z^9 - 4*y^7*z^9 + x^6*z^10 + 3*x^4*y^2*z^10 + 8*x^3*y^3*z^10 + 3*x^2*y^4*z^10 + y^6*z^10]
```
由前面的猜测，$F$ 定号，任取一点代入$>0$，推出 $F \ge 0.$


3.
$$
\begin{align*}
&\left( 2\left( \sum_{\mathrm{cyc}}{\left( x\left( x-y \right) \left( x-z \right) \right)} \right) +\prod_{\mathrm{cyc}}{\left( y+z-x \right)} \right) \left( \sum_{\mathrm{cyc}}{\left( x^3\left( y^2+z^2-x^2 \right) ^2\left( x-y \right) \left( x-z \right) \right)} \right) 
\\
&+4\left( \prod_{\mathrm{cyc}}{\left( y^2+z^2-x^2 \right)} \right) \left( \sum_{\mathrm{cyc}}{\left( x^2\left( y^2+z^2-x^2 \right) \left( x-y \right) \left( x-z \right) \right)} \right) \ge 0.
\end{align*}
$$

$$
X=\frac{\left( \begin{array}{c}
	x^7y-x^5y^3-x^3y^5+xy^7+x^7z-3x^6yz-x^5y^2z+3x^4y^3z+3x^3y^4z-x^2y^5z-3xy^6z\\
	+y^7z-x^5yz^2+x^4y^2z^2-2x^3y^3z^2+x^2y^4z^2-xy^5z^2-x^5z^3+3x^4yz^3-2x^3y^2z^3\\
	-2x^2y^3z^3+3xy^4z^3-y^5z^3+3x^3yz^4+x^2y^2z^4+3xy^3z^4\\
	-x^3z^5-x^2yz^5-xy^2z^5-y^3z^5-3xyz^6+xz^7+yz^7\\
\end{array} \right)}{\left( x-y \right) \left( x-z \right) \left( x-y-z \right) \left( y-z \right) \left( x+y-z \right) \left( x-y+z \right) \left( x+y+z \right) ^2}
$$

$$
Y=\frac{\left( \begin{array}{c}
	2x^6y^2-4x^4y^4+2x^2y^6-3x^6yz-x^5y^2z+4x^4y^3z+4x^3y^4z-x^2y^5z-3xy^6z+2x^6z^2\\
	-x^5yz^2-x^4y^2z^2-2x^3y^3z^2-x^2y^4z^2-xy^5z^2+2y^6z^2+4x^4yz^3-2x^3y^2z^3-2x^2y^3z^3\\
	+4xy^4z^3-4x^4z^4+4x^3yz^4-x^2y^2z^4+4xy^3z^4-4y^4z^4-x^2yz^5-xy^2z^5+2x^2z^6-3xyz^6+2y^2z^6\\
\end{array} \right)}{\left( x-y \right) \left( x-z \right) \left( x-y-z \right) \left( y-z \right) \left( x+y-z \right) \left( x-y+z \right) \left( x+y+z \right) ^2}
$$

```
{X, Y} == {(x^7*y - x^5*y^3 - x^3*y^5 + x*y^7 + x^7*z - 3*x^6*y*z - x^5*y^2*z + 3*x^4*y^3*z + 3*x^3*y^4*z - x^2*y^5*z - 3*x*y^6*z + y^7*z - x^5*y*z^2 + x^4*y^2*z^2 - 2*x^3*y^3*z^2 + x^2*y^4*z^2 - x*y^5*z^2 - x^5*z^3 + 3*x^4*y*z^3 - 2*x^3*y^2*z^3 - 2*x^2*y^3*z^3 + 3*x*y^4*z^3 - y^5*z^3 + 3*x^3*y*z^4 + x^2*y^2*z^4 + 3*x*y^3*z^4 - x^3*z^5 - x^2*y*z^5 - x*y^2*z^5 - y^3*z^5 - 3*x*y*z^6 + x*z^7 + y*z^7)/((x - y)*(x - z)*(x - y - z)*(y - z)*(x + y - z)*(x - y + z)*(x + y + z)^2), (2*x^6*y^2 - 4*x^4*y^4 + 2*x^2*y^6 - 3*x^6*y*z - x^5*y^2*z + 4*x^4*y^3*z + 4*x^3*y^4*z - x^2*y^5*z - 3*x*y^6*z + 2*x^6*z^2 - x^5*y*z^2 - x^4*y^2*z^2 - 2*x^3*y^3*z^2 - x^2*y^4*z^2 - x*y^5*z^2 + 2*y^6*z^2 + 4*x^4*y*z^3 - 2*x^3*y^2*z^3 - 2*x^2*y^3*z^3 + 4*x*y^4*z^3 - 4*x^4*z^4 + 4*x^3*y*z^4 - x^2*y^2*z^4 + 4*x*y^3*z^4 - 4*y^4*z^4 - x^2*y*z^5 - x*y^2*z^5 + 2*x^2*z^6 - 3*x*y*z^6 + 2*y^2*z^6)/((x - y)*(x - z)*(x - y - z)*(y - z)*(x + y - z)*(x - y + z)*(x + y + z)^2)}
```
$$
\left( \begin{array}{c}
	750+5355\!\:X^2+8280\!\:X^4+2895\!\:X^6-11590\!\:X\!\:Y-30682\!\:X^3\!\:Y-15856\!\:X^5\!\:Y\\
	+6355\!\:Y^2+45158\!\:X^2\!\:Y^2+40343\!\:X^4\!\:Y^2-33278\!\:X\!\:Y^3-56160\!\:X^3\!\:Y^3\\
	+10042\!\:Y^4+45701\!\:X^2\!\:Y^4-21232\!\:X\!\:Y^5+4437\!\:Y^6\\
\end{array} \right) =\frac{FG}{\left( \cdots \right) ^6}\ge 0
$$

但 $LHS(X,Y)$ 不是严格正定的，零点是 $G$ 引入的，$\rm{deg}{(G)} = 36$.
```
750+5355 X^2+8280 X^4+2895 X^6-11590 X Y-30682 X^3 Y-15856 X^5 Y+6355 Y^2+45158 X^2 Y^2+40343 X^4 Y^2-33278 X Y^3-56160 X^3 Y^3+10042 Y^4+45701 X^2 Y^4-21232 X Y^5+4437 Y^6
```

配方

```
(1210845*X + 1948335*X^3 - 1070205*Y - 3794374*X^2*Y + 2784763*X*Y^2 - 950068*Y^3)^2/1311229455 + (10673241932219*(900*X - 1600*Y + 673*X^2*Y + 1526*X*Y^2 - 1847*Y^3)^2)/11006642743240730 + (-367813266600 - 865016058300*X^2 + 1889327628625*X*Y + 1093546501650*X^3*Y - 895669018185*Y^2 - 2994693148560*X^2*Y^2 + 2366517731550*X*Y^3 - 470281383504*Y^4)^2/413072176604819845500 + (2969351176968008677662591992167186883047*(9085500 + 79521435*X*Y - 110800415*Y^2 + 151094508*X*Y^3 - 135532092*Y^4)^2)/58534532736716079215112668124053300179131159330586500 + (4094182223854249575 + 23485561590280668225*X^2 - 55766521587817064200*X*Y + 28934019248547375495*Y^2 + 44908492956730292100*X^2*Y^2 - 71227416579469569600*X*Y^3 + 27391730719937090508*Y^4)^2/330507105721296889787658263124450000 + (5057702771134397284545968629347225 + 9143468555138650395078765344810175*X^2 - 14775699152181128069013717400418600*X*Y + 10589776557911757221066847820550585*Y^2 - 9771452162731202865470089062407400*X*Y^3 + 6977485464548741170765800208568664*Y^4)^2/69590819307140210624694324370524025860793911903072097924873950000
```

###### 引入的$G$ 看起来是不可控的，不受$f,g,h$选择影响(固定次数下看起来是这样)，而是由 $F$ 决定. 所以这个方法偶尔好用

