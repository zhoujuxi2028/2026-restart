import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Java数据处理器 - 用于演示Node.js与Java的集成
 * 提供字符串处理、数组操作、数学计算等功能
 */
public class DataProcessor {

    public static void main(String[] args) {
        long startTime = System.nanoTime();

        if (args.length < 2) {
            printUsage();
            System.exit(1);
        }

        String operation = args[0];

        try {
            System.out.println("[Java] Starting data processing...");
            System.out.println("[Java] Operation: " + operation);
            System.out.println("[Java] Arguments: " + Arrays.toString(Arrays.copyOfRange(args, 1, args.length)));

            switch (operation.toLowerCase()) {
                case "reverse":
                    handleReverse(args);
                    break;
                case "sort":
                    handleSort(args);
                    break;
                case "unique":
                    handleUnique(args);
                    break;
                case "prime":
                    handlePrime(args);
                    break;
                case "factorial":
                    handleFactorial(args);
                    break;
                case "uppercase":
                    handleUppercase(args);
                    break;
                case "wordcount":
                    handleWordCount(args);
                    break;
                case "palindrome":
                    handlePalindrome(args);
                    break;
                default:
                    System.out.println("Error: Unknown operation '" + operation + "'");
                    printUsage();
                    System.exit(1);
            }

            long endTime = System.nanoTime();
            double executionTimeMs = (endTime - startTime) / 1_000_000.0;

            System.out.println("[Java] Execution time: " + String.format("%.3f", executionTimeMs) + "ms");
            System.out.println("[Java] Processing completed successfully!");

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            System.exit(1);
        }
    }

    // 字符串反转
    private static void handleReverse(String[] args) {
        if (args.length != 2) {
            throw new IllegalArgumentException("Reverse operation requires exactly 1 string");
        }

        String input = args[1];
        String reversed = new StringBuilder(input).reverse().toString();

        System.out.println("[Java] Reversing string: \"" + input + "\"");
        System.out.println("RESULT: " + reversed);
    }

    // 字符串数组排序
    private static void handleSort(String[] args) {
        if (args.length < 2) {
            throw new IllegalArgumentException("Sort operation requires at least 1 element");
        }

        String[] elements = Arrays.copyOfRange(args, 1, args.length);
        Arrays.sort(elements);

        System.out.println("[Java] Sorting elements: " + Arrays.toString(Arrays.copyOfRange(args, 1, args.length)));
        System.out.println("RESULT: " + String.join(",", elements));
    }

    // 数组去重
    private static void handleUnique(String[] args) {
        if (args.length < 2) {
            throw new IllegalArgumentException("Unique operation requires at least 1 element");
        }

        String[] elements = Arrays.copyOfRange(args, 1, args.length);
        List<String> uniqueList = Arrays.stream(elements)
                                       .distinct()
                                       .collect(Collectors.toList());

        System.out.println("[Java] Removing duplicates from: " + Arrays.toString(elements));
        System.out.println("RESULT: " + String.join(",", uniqueList));
    }

    // 质数检查
    private static void handlePrime(String[] args) {
        if (args.length != 2) {
            throw new IllegalArgumentException("Prime operation requires exactly 1 number");
        }

        int number = Integer.parseInt(args[1]);
        boolean isPrime = isPrimeNumber(number);

        System.out.println("[Java] Checking if " + number + " is prime");
        System.out.println("RESULT: " + isPrime);
    }

    // 阶乘计算
    private static void handleFactorial(String[] args) {
        if (args.length != 2) {
            throw new IllegalArgumentException("Factorial operation requires exactly 1 number");
        }

        int number = Integer.parseInt(args[1]);
        if (number < 0) {
            throw new IllegalArgumentException("Factorial requires non-negative number");
        }
        if (number > 20) {
            throw new IllegalArgumentException("Factorial input too large (max 20)");
        }

        long factorial = calculateFactorial(number);

        System.out.println("[Java] Calculating factorial of " + number);
        System.out.println("RESULT: " + factorial);
    }

    // 转大写
    private static void handleUppercase(String[] args) {
        if (args.length != 2) {
            throw new IllegalArgumentException("Uppercase operation requires exactly 1 string");
        }

        String input = args[1];
        String uppercase = input.toUpperCase();

        System.out.println("[Java] Converting to uppercase: \"" + input + "\"");
        System.out.println("RESULT: " + uppercase);
    }

    // 单词计数
    private static void handleWordCount(String[] args) {
        if (args.length != 2) {
            throw new IllegalArgumentException("WordCount operation requires exactly 1 string");
        }

        String input = args[1];
        String[] words = input.trim().split("\\s+");
        int wordCount = input.trim().isEmpty() ? 0 : words.length;

        System.out.println("[Java] Counting words in: \"" + input + "\"");
        System.out.println("RESULT: " + wordCount);
    }

    // 回文检查
    private static void handlePalindrome(String[] args) {
        if (args.length != 2) {
            throw new IllegalArgumentException("Palindrome operation requires exactly 1 string");
        }

        String input = args[1].toLowerCase().replaceAll("[^a-z0-9]", "");
        String reversed = new StringBuilder(input).reverse().toString();
        boolean isPalindrome = input.equals(reversed);

        System.out.println("[Java] Checking if \"" + args[1] + "\" is palindrome");
        System.out.println("[Java] Normalized: \"" + input + "\"");
        System.out.println("RESULT: " + isPalindrome);
    }

    // 质数检查辅助方法
    private static boolean isPrimeNumber(int n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;

        for (int i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) {
                return false;
            }
        }
        return true;
    }

    // 阶乘计算辅助方法
    private static long calculateFactorial(int n) {
        if (n == 0 || n == 1) return 1;

        long result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    private static void printUsage() {
        System.out.println("Usage: java DataProcessor <operation> <arguments>");
        System.out.println("Operations:");
        System.out.println("  reverse <string>           - Reverse a string");
        System.out.println("  sort <item1> <item2>...    - Sort array elements");
        System.out.println("  unique <item1> <item2>...  - Remove duplicates from array");
        System.out.println("  prime <number>             - Check if number is prime");
        System.out.println("  factorial <number>         - Calculate factorial (max 20)");
        System.out.println("  uppercase <string>         - Convert string to uppercase");
        System.out.println("  wordcount <string>         - Count words in string");
        System.out.println("  palindrome <string>        - Check if string is palindrome");
        System.out.println();
        System.out.println("Examples:");
        System.out.println("  java DataProcessor reverse \"Hello World\"");
        System.out.println("  java DataProcessor sort apple banana cherry");
        System.out.println("  java DataProcessor prime 17");
        System.out.println("  java DataProcessor factorial 5");
    }
}