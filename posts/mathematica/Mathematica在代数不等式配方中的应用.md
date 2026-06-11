### Mathematica 在代数不等式配方中的应用

Mathematica 是进行符号代数计算的强大工具。在实对称不等式的研究中，我们经常需要寻找齐次多项式的代数平方和（SOS）分解。

## 1. 概念与原理

对于三元四次齐次多项式 $f(x,y,z)$，如果能表示为：
$$
f(x,y,z) = \sum_{k} (g_k(x,y,z))^2
$$
则显然 $f(x,y,z) \ge 0$ 恒成立。在 Mathematica 中，我们可以通过半正定规划（SDP）或代数方程组消元法来寻找 $g_k$ 的系数。

## 2. 代码实现

以下是用于辅助配方的 Mathematica 代码片段：

```mathematica
(* 定义对称多项式 *)
S1[x_, y_, z_] := x + y + z;
S2[x_, y_, z_] := x*y + y*z + z*x;
S3[x_, y_, z_] := x*y*z;

(* 半正定分解辅助程序 *)
DecomposeSOS[poly_, vars_] := Module[{coef, mat},
    (* 多项式求值与系数匹配 *)
    ...
];
```

通过将变量代换为齐次形式，我们可以极大地简化高次不等式的机器证明。
