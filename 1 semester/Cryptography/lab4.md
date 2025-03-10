### Ответы на контрольные вопросы:

**1. Цель применения протокола Диффи-Хеллмана.**  
Протокол Диффи-Хеллмана используется для безопасного обмена криптографическими ключами между двумя сторонами в небезопасной сети. Его цель — обеспечить общий секретный ключ, который может быть использован для дальнейшего шифрования данных, без необходимости передачи самого ключа.

---

**2. Что представляет собой эллиптическая кривая?**  
Эллиптическая кривая в криптографии — это множество точек, удовлетворяющих уравнению вида:  
\[ y^2 = x^3 + ax + b \, (\text{mod} \, p) \]  
где \( a \) и \( b \) — коэффициенты, определяющие форму кривой, а \( p \) — модуль, если используется поле конечных чисел. Такие кривые обладают особыми математическими свойствами, которые делают их полезными в криптографических приложениях.

---

**3. Какие операции определены на эллиптической кривой при использовании в криптографических приложениях?**  
На эллиптической кривой определены следующие операции:  
- **Сложение двух точек**: вычисление новой точки на кривой путём сложения двух других.  
- **Удвоение точки**: вычисление точки, полученной путём удвоения одной точки.  
- **Умножение точки на число**: операция, состоящая из последовательного сложения точки.  

Эти операции образуют абелеву группу, что важно для построения криптографических алгоритмов.

---

**4. Как выполнить умножение точки эллиптической кривой на число?**  
Умножение точки \( P \) на число \( k \) выполняется с использованием метода двойного и добавления:  
1. Представить число \( k \) в двоичной форме.  
2. Инициализировать результат как точку на бесконечности (нулевая точка).  
3. Постепенно добавлять \( P \) в зависимости от битов \( k \), удваивая промежуточный результат на каждом шаге.  

Этот алгоритм позволяет эффективно вычислить \( kP \).

---

**5. Как вычислить число, обратное к данному по заданному модулю?**  
Чтобы найти число \( x^{-1} \), обратное к \( x \) по модулю \( p \), используется алгоритм расширенного Евклида:  
1. Выполнить расширенный алгоритм Евклида для чисел \( x \) и \( p \).  
2. Найти коэффициент \( a \), такой что \( ax + bp = 1 \).  
3. Число \( a \, (\text{mod} \, p) \) является обратным к \( x \).  

Для полей Галуа, где модуль — простое число, это число всегда существует.

---

**6. Что является нулем эллиптической кривой?**  
Нулём эллиптической кривой называют **особую точку на бесконечности**.  
- Эта точка обозначается \( O \) и служит нейтральным элементом для операции сложения точек.  
- При сложении точки \( P \) с \( O \), результат остаётся равным \( P \), т.е. \( P + O = P \).  
- В криптографическом контексте \( O \) используется для построения математической структуры группы.