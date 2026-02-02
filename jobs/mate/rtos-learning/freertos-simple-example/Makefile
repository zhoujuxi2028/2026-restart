# FreeRTOS学习项目 Makefile
# 适用于macOS平台

# 编译器和工具
CC = gcc
OBJCOPY = objcopy
SIZE = size

# 项目名称
PROJECT = freertos_demo

# 目录定义
SRC_DIR = src
INC_DIR = include
BUILD_DIR = build

# 源文件
SOURCES = $(SRC_DIR)/main.c $(SRC_DIR)/freertos_sim.c

# 目标文件
OBJECTS = $(SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)

# 包含路径
INCLUDES = -I$(INC_DIR)

# 编译标志
CFLAGS = -Wall -Wextra -std=c99 -O0 -g3
CFLAGS += $(INCLUDES)
CFLAGS += -DDEBUG=1

# 链接标志
LDFLAGS = -lpthread

# 默认目标
all: $(BUILD_DIR)/$(PROJECT)

# 创建输出目录
$(BUILD_DIR):
	@mkdir -p $(BUILD_DIR)

# 编译目标文件
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c | $(BUILD_DIR)
	@echo "编译: $<"
	$(CC) $(CFLAGS) -c $< -o $@

# 链接生成可执行文件
$(BUILD_DIR)/$(PROJECT): $(OBJECTS)
	@echo "链接: $@"
	$(CC) $(OBJECTS) $(LDFLAGS) -o $@
	@echo "编译完成: $@"

# 运行程序
run: $(BUILD_DIR)/$(PROJECT)
	@echo "运行FreeRTOS演示程序..."
	@echo "按Ctrl+C退出程序"
	./$(BUILD_DIR)/$(PROJECT)

# 调试运行
debug: $(BUILD_DIR)/$(PROJECT)
	@echo "调试模式运行..."
	lldb ./$(BUILD_DIR)/$(PROJECT)

# 清理
clean:
	@echo "清理编译文件..."
	rm -rf $(BUILD_DIR)

# 显示大小信息
size: $(BUILD_DIR)/$(PROJECT)
	$(SIZE) $<

# 帮助信息
help:
	@echo "FreeRTOS学习项目构建系统"
	@echo ""
	@echo "可用的目标:"
	@echo "  all     - 编译项目 (默认)"
	@echo "  run     - 编译并运行程序"
	@echo "  debug   - 调试模式运行"
	@echo "  clean   - 清理编译文件"
	@echo "  size    - 显示程序大小信息"
	@echo "  help    - 显示此帮助信息"
	@echo ""
	@echo "示例用法:"
	@echo "  make        # 编译项目"
	@echo "  make run    # 编译并运行"
	@echo "  make clean  # 清理文件"

# 声明伪目标
.PHONY: all run debug clean size help

# 禁用内置规则
.SUFFIXES: