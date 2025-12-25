"""
Практическое задание №4. Матричная игра

Дана матричная игра с платежной матрицей:
    2  4  8
    5  6  2
    4  6  3
    2  5  4

Исследование игры на равновесие Нэша и решение в чистых стратегиях,
сведение к задаче линейного программирования и решение в смешанных стратегиях.
"""

import numpy as np
from scipy.optimize import linprog

print("=" * 70)
print("ПРАКТИЧЕСКОЕ ЗАДАНИЕ №4: МАТРИЧНАЯ ИГРА")
print("=" * 70)

# ============================================================================
# ИСХОДНЫЕ ДАННЫЕ
# ============================================================================

# Платежная матрица (4 строки для игрока 1, 3 столбца для игрока 2)
A = np.array([
    [2, 4, 8],
    [5, 6, 2],
    [4, 6, 3],
    [2, 5, 4]
])

print("\n" + "=" * 70)
print("ЧАСТЬ 1: ИССЛЕДОВАНИЕ ИГРЫ НА РАВНОВЕСИЕ НЭША В ЧИСТЫХ СТРАТЕГИЯХ")
print("=" * 70)

print("\nПлатежная матрица A (выигрыши игрока 1):")
print(A)
print("\nРазмерность: {} строк (стратегии игрока 1) × {} столбцов (стратегии игрока 2)".format(A.shape[0], A.shape[1]))

# Находим минимальные значения по строкам (минимакс для игрока 1)
row_minima = np.min(A, axis=1)
print("\nМинимальные значения по строкам (минимакс для игрока 1):")
for i, val in enumerate(row_minima):
    print(f"  Строка {i+1}: min = {val}")

maximin = np.max(row_minima)
maximin_row = np.argmax(row_minima)
print(f"\nМаксимин (нижняя цена игры): v_1 = {maximin}")
print(f"Достигается на строке {maximin_row + 1}")

# Находим максимальные значения по столбцам (максимин для игрока 2)
col_maxima = np.max(A, axis=0)
print("\nМаксимальные значения по столбцам (максимин для игрока 2):")
for j, val in enumerate(col_maxima):
    print(f"  Столбец {j+1}: max = {val}")

minimax = np.min(col_maxima)
minimax_col = np.argmin(col_maxima)
print(f"\nМинимакс (верхняя цена игры): v_2 = {minimax}")
print(f"Достигается на столбце {minimax_col + 1}")

# Проверка на седловую точку
print("\n" + "-" * 70)
print("Проверка на седловую точку (равновесие Нэша в чистых стратегиях):")
print(f"  v_1 (максимин) = {maximin}")
print(f"  v_2 (минимакс) = {minimax}")

if maximin == minimax:
    print(f"\n✓ Седловая точка найдена! v = {maximin}")
    print(f"  Оптимальные чистые стратегии:")
    print(f"    - Игрок 1: строка {maximin_row + 1}")
    print(f"    - Игрок 2: столбец {minimax_col + 1}")
    print(f"  Значение игры: v = {maximin}")
else:
    print(f"\n✗ Седловой точки нет (v_1 = {maximin} ≠ v_2 = {minimax})")
    print("  Равновесия Нэша в чистых стратегиях не существует.")
    print("  Необходимо искать решение в смешанных стратегиях.")

# ============================================================================
# ЧАСТЬ 2: СВЕДЕНИЕ К ЗАДАЧЕ ЛИНЕЙНОГО ПРОГРАММИРОВАНИЯ
# ============================================================================

print("\n" + "=" * 70)
print("ЧАСТЬ 2: СВЕДЕНИЕ ИГРЫ К ЗАДАЧЕ ЛИНЕЙНОГО ПРОГРАММИРОВАНИЯ")
print("=" * 70)

# Проверяем, все ли элементы матрицы положительны
min_val = np.min(A)
print(f"\nМинимальное значение в матрице: {min_val}")

if min_val <= 0:
    # Делаем все элементы положительными, добавляя константу
    shift = abs(min_val) + 1
    A_shifted = A + shift
    print(f"Добавляем константу {shift} ко всем элементам матрицы")
    print("Новая матрица (все элементы положительны):")
    print(A_shifted)
else:
    A_shifted = A.copy()
    shift = 0

# Задача для игрока 1 (максимизация выигрыша)
# Переменные: p_1, p_2, p_3, p_4 (вероятности выбора строк игроком 1)
# Целевая функция: максимизировать v (значение игры)
# Ограничения: A^T * p >= v * 1, sum(p) = 1, p >= 0

print("\n" + "-" * 70)
print("Задача линейного программирования для игрока 1:")
print("-" * 70)
print("Переменные: p_1, p_2, p_3, p_4 (вероятности выбора строк)")
print("Целевая функция: максимизировать v")
print("Ограничения:")
print("  A^T * p >= v * 1  (для каждого столбца)")
print("  p_1 + p_2 + p_3 + p_4 = 1")
print("  p_i >= 0, i = 1, 2, 3, 4")

# Преобразуем к стандартной форме для linprog (минимизация)
# Вводим переменные: x = [p_1, p_2, p_3, p_4, v]
# Для минимизации: min -v (что эквивалентно max v)
# Ограничения: A^T * p - v >= 0, sum(p) = 1, p >= 0, v >= 0

# Для игрока 1: max v при условиях A^T * p >= v, sum(p) = 1, p >= 0
# Преобразуем: min -v при условиях -A^T * p + v <= 0, sum(p) = 1, p >= 0

# ============================================================================
# ЧАСТЬ 3: РЕШЕНИЕ В СМЕШАННЫХ СТРАТЕГИЯХ
# ============================================================================

print("\n" + "=" * 70)
print("ЧАСТЬ 3: РЕШЕНИЕ ИГРЫ В СМЕШАННЫХ СТРАТЕГИЯХ")
print("=" * 70)

# Метод 1: Решение через двойственные задачи ЛП

# Задача для игрока 1 (максимизация)
# max v
# при условиях:
#   A^T * p >= v * 1  (для каждого столбца j)
#   sum(p) = 1
#   p >= 0

# Преобразуем к стандартной форме linprog (минимизация)
# Переменные: x = [p_1, p_2, p_3, p_4, v]
# min -v = [0, 0, 0, 0, -1] * x
# Ограничения:
#   -A^T * p + v <= 0  (для каждого столбца)
#   sum(p) = 1
#   p >= 0, v >= 0

# Коэффициенты целевой функции (минимизируем -v)
c_player1 = np.array([0, 0, 0, 0, -1])

# Ограничения -A^T * p + v <= 0
# Это эквивалентно: A^T * p >= v
# Для linprog: -A^T * p + v <= 0
A_ub_player1 = []
b_ub_player1 = []
for j in range(A_shifted.shape[1]):
    row = [-A_shifted[i, j] for i in range(A_shifted.shape[0])] + [1]
    A_ub_player1.append(row)
    b_ub_player1.append(0)

A_ub_player1 = np.array(A_ub_player1)

# Ограничение sum(p) = 1
A_eq_player1 = np.array([[1, 1, 1, 1, 0]])
b_eq_player1 = np.array([1])

# Границы: p_i >= 0, v >= 0
bounds_player1 = [(0, None)] * 4 + [(0, None)]

# Решение для игрока 1
result_player1 = linprog(c_player1, A_ub=A_ub_player1, b_ub=b_ub_player1, 
                         A_eq=A_eq_player1, b_eq=b_eq_player1, 
                         bounds=bounds_player1, method='highs')

p_optimal = result_player1.x[:4]
v_shifted = result_player1.x[4]
v_original = v_shifted - shift

print("\n" + "-" * 70)
print("Решение для игрока 1 (максимизация выигрыша):")
print("-" * 70)
print(f"Статус решения: {result_player1.message}")
print(f"\nОптимальные вероятности выбора строк:")
for i, prob in enumerate(p_optimal):
    print(f"  p_{i+1} = {prob:.6f}")
print(f"\nЗначение игры (с учетом сдвига): v = {v_shifted:.6f}")
if shift > 0:
    print(f"Значение игры (оригинальное): v = {v_original:.6f}")

# Задача для игрока 2 (минимизация)
# min v
# при условиях:
#   A * q <= v * 1  (для каждой строки i)
#   sum(q) = 1
#   q >= 0

# Преобразуем к стандартной форме linprog
# Переменные: y = [q_1, q_2, q_3, v]
# min v = [0, 0, 0, 1] * y
# Ограничения:
#   A * q - v <= 0  (для каждой строки)
#   sum(q) = 1
#   q >= 0, v >= 0

# Коэффициенты целевой функции
c_player2 = np.array([0, 0, 0, 1])

# Ограничения A * q - v <= 0
A_ub_player2 = []
b_ub_player2 = []
for i in range(A_shifted.shape[0]):
    row = [A_shifted[i, j] for j in range(A_shifted.shape[1])] + [-1]
    A_ub_player2.append(row)
    b_ub_player2.append(0)

A_ub_player2 = np.array(A_ub_player2)

# Ограничение sum(q) = 1
A_eq_player2 = np.array([[1, 1, 1, 0]])
b_eq_player2 = np.array([1])

# Границы: q_j >= 0, v >= 0
bounds_player2 = [(0, None)] * 3 + [(0, None)]

# Решение для игрока 2
result_player2 = linprog(c_player2, A_ub=A_ub_player2, b_ub=b_ub_player2,
                         A_eq=A_eq_player2, b_eq=b_eq_player2,
                         bounds=bounds_player2, method='highs')

q_optimal = result_player2.x[:3]
v_shifted2 = result_player2.x[3]
v_original2 = v_shifted2 - shift

print("\n" + "-" * 70)
print("Решение для игрока 2 (минимизация проигрыша):")
print("-" * 70)
print(f"Статус решения: {result_player2.message}")
print(f"\nОптимальные вероятности выбора столбцов:")
for j, prob in enumerate(q_optimal):
    print(f"  q_{j+1} = {prob:.6f}")
print(f"\nЗначение игры (с учетом сдвига): v = {v_shifted2:.6f}")
if shift > 0:
    print(f"Значение игры (оригинальное): v = {v_original2:.6f}")

# Проверка: значения игры должны совпадать (теорема о двойственности)
print("\n" + "-" * 70)
print("Проверка решения:")
print("-" * 70)
print(f"Значение игры (игрок 1): v = {v_original:.6f}")
print(f"Значение игры (игрок 2): v = {v_original2:.6f}")
if abs(v_original - v_original2) < 1e-5:
    print("✓ Значения совпадают (с точностью до погрешности вычислений)")
else:
    print("⚠ Значения различаются (возможна ошибка вычислений)")

# Проверка оптимальности стратегий
print("\nПроверка оптимальности стратегий:")
expected_payoff = np.dot(p_optimal, np.dot(A, q_optimal))
print(f"Ожидаемый выигрыш при оптимальных смешанных стратегиях: {expected_payoff:.6f}")
print(f"Значение игры: {v_original:.6f}")
if abs(expected_payoff - v_original) < 1e-5:
    print("✓ Ожидаемый выигрыш совпадает со значением игры")

# Проверка ограничений
print("\nПроверка ограничений для игрока 1:")
for j in range(A.shape[1]):
    payoff = np.dot(p_optimal, A[:, j])
    print(f"  Ожидаемый выигрыш при выборе игроком 2 столбца {j+1}: {payoff:.6f} >= {v_original:.6f}")
    if payoff >= v_original - 1e-5:
        print(f"    ✓ Ограничение выполнено")
    else:
        print(f"    ✗ Ограничение не выполнено")

print("\nПроверка ограничений для игрока 2:")
for i in range(A.shape[0]):
    payoff = np.dot(A[i, :], q_optimal)
    print(f"  Ожидаемый проигрыш при выборе игроком 1 строки {i+1}: {payoff:.6f} <= {v_original:.6f}")
    if payoff <= v_original + 1e-5:
        print(f"    ✓ Ограничение выполнено")
    else:
        print(f"    ✗ Ограничение не выполнено")

print("\n" + "=" * 70)
print("РЕШЕНИЕ ЗАВЕРШЕНО")
print("=" * 70)

