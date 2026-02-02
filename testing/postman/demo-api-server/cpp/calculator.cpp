#include <iostream>
#include <string>
#include <chrono>
#include <iomanip>

using namespace std;
using namespace std::chrono;

// 加法运算
int add(int a, int b) {
    return a + b;
}

// 乘法运算
long long multiply(int a, int b) {
    return (long long)a * b;
}

// 斐波那契数列计算
long long fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;

    long long prev = 0, curr = 1;
    for (int i = 2; i <= n; i++) {
        long long next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

// 计算数组元素平方和
long long sumOfSquares(int arr[], int size) {
    long long sum = 0;
    for (int i = 0; i < size; i++) {
        sum += (long long)arr[i] * arr[i];
    }
    return sum;
}

void printUsage() {
    cout << "Usage: ./calculator <operation> <number1> [number2] [number3...]" << endl;
    cout << "Operations:" << endl;
    cout << "  add <a> <b>        - Addition: a + b" << endl;
    cout << "  multiply <a> <b>   - Multiplication: a * b" << endl;
    cout << "  fibonacci <n>      - Fibonacci number at position n" << endl;
    cout << "  squares <n1> <n2>... - Sum of squares of all numbers" << endl;
}

int main(int argc, char* argv[]) {
    auto start = high_resolution_clock::now();

    if (argc < 3) {
        printUsage();
        return 1;
    }

    string operation = argv[1];

    cout << "[C++] Starting calculation..." << endl;
    cout << "[C++] Operation: " << operation << endl;

    try {
        if (operation == "add") {
            if (argc != 4) {
                cout << "Error: Add operation requires exactly 2 numbers" << endl;
                return 1;
            }
            int a = stoi(argv[2]);
            int b = stoi(argv[3]);
            int result = add(a, b);

            cout << "[C++] Calculating: " << a << " + " << b << endl;
            cout << "RESULT: " << result << endl;

        } else if (operation == "multiply") {
            if (argc != 4) {
                cout << "Error: Multiply operation requires exactly 2 numbers" << endl;
                return 1;
            }
            int a = stoi(argv[2]);
            int b = stoi(argv[3]);
            long long result = multiply(a, b);

            cout << "[C++] Calculating: " << a << " * " << b << endl;
            cout << "RESULT: " << result << endl;

        } else if (operation == "fibonacci") {
            if (argc != 3) {
                cout << "Error: Fibonacci operation requires exactly 1 number" << endl;
                return 1;
            }
            int n = stoi(argv[2]);
            if (n < 0) {
                cout << "Error: Fibonacci position must be non-negative" << endl;
                return 1;
            }
            long long result = fibonacci(n);

            cout << "[C++] Calculating: fibonacci(" << n << ")" << endl;
            cout << "RESULT: " << result << endl;

        } else if (operation == "squares") {
            if (argc < 3) {
                cout << "Error: Squares operation requires at least 1 number" << endl;
                return 1;
            }

            int count = argc - 2;
            int* numbers = new int[count];

            cout << "[C++] Numbers: ";
            for (int i = 0; i < count; i++) {
                numbers[i] = stoi(argv[i + 2]);
                cout << numbers[i] << " ";
            }
            cout << endl;

            long long result = sumOfSquares(numbers, count);
            cout << "[C++] Calculating sum of squares..." << endl;
            cout << "RESULT: " << result << endl;

            delete[] numbers;

        } else {
            cout << "Error: Unknown operation '" << operation << "'" << endl;
            printUsage();
            return 1;
        }

        auto end = high_resolution_clock::now();
        auto duration = duration_cast<microseconds>(end - start);

        cout << "[C++] Execution time: " << fixed << setprecision(3)
             << duration.count() / 1000.0 << "ms" << endl;
        cout << "[C++] Calculation completed successfully!" << endl;

        return 0;

    } catch (const invalid_argument& e) {
        cout << "Error: Invalid number format" << endl;
        return 1;
    } catch (const out_of_range& e) {
        cout << "Error: Number out of range" << endl;
        return 1;
    } catch (const exception& e) {
        cout << "Error: " << e.what() << endl;
        return 1;
    }
}