# API & GUI测试实战指南
> 针对网络设备管理系统测试场景

## 📋 API测试基础

### HTTP方法与测试场景
| 方法 | 用途 | 测试重点 |
|------|------|----------|
| GET | 获取资源 | 参数验证、分页、缓存、性能 |
| POST | 创建资源 | 数据格式、业务逻辑、错误处理 |
| PUT | 更新资源 | 幂等性、部分更新、并发控制 |
| DELETE | 删除资源 | 软删除、级联删除、权限验证 |

### 状态码验证重点
```javascript
// 成功场景
200 OK, 201 Created, 204 No Content

// 客户端错误
400 Bad Request - 参数格式错误
401 Unauthorized - 认证失败
403 Forbidden - 权限不足
404 Not Found - 资源不存在
409 Conflict - 资源冲突

// 服务端错误
500 Internal Server Error - 服务器错误
502 Bad Gateway - 网关错误
503 Service Unavailable - 服务不可用
```

## 🛠 Postman实战技巧

### 1. 环境变量设置
```javascript
// Pre-request Script - 自动获取Token
pm.sendRequest({
    url: '{{base_url}}/auth/login',
    method: 'POST',
    header: 'Content-Type:application/json',
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            username: '{{username}}',
            password: '{{password}}'
        })
    }
}, function (err, res) {
    pm.environment.set('token', res.json().token);
});
```

### 2. 测试脚本示例
```javascript
// Tests - 响应验证
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Device list contains expected fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.devices).to.be.an('array');
    pm.expect(jsonData.devices[0]).to.have.property('device_id');
    pm.expect(jsonData.devices[0]).to.have.property('ip_address');
});
```

## 🐍 Python API测试框架

### 基础测试类
```python
import requests
import pytest
import json
from datetime import datetime

class NetworkDeviceAPI:
    def __init__(self, base_url, username, password):
        self.base_url = base_url
        self.session = requests.Session()
        self.token = None
        self._authenticate(username, password)

    def _authenticate(self, username, password):
        """获取认证Token"""
        auth_data = {
            'username': username,
            'password': password
        }
        response = self.session.post(
            f'{self.base_url}/auth/login',
            json=auth_data
        )
        assert response.status_code == 200
        self.token = response.json()['token']
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}'
        })

    def get_devices(self, page=1, limit=10):
        """获取设备列表"""
        params = {'page': page, 'limit': limit}
        response = self.session.get(
            f'{self.base_url}/api/devices',
            params=params
        )
        return response

    def create_device(self, device_data):
        """创建设备"""
        response = self.session.post(
            f'{self.base_url}/api/devices',
            json=device_data
        )
        return response

    def update_device_config(self, device_id, config):
        """更新设备配置"""
        response = self.session.put(
            f'{self.base_url}/api/devices/{device_id}/config',
            json=config
        )
        return response
```

### 测试用例实现
```python
class TestNetworkDeviceAPI:
    @pytest.fixture
    def api_client(self):
        return NetworkDeviceAPI(
            'http://192.168.1.100:8080',
            'admin',
            'password123'
        )

    def test_get_devices_success(self, api_client):
        """测试获取设备列表 - 成功场景"""
        response = api_client.get_devices()

        assert response.status_code == 200
        data = response.json()
        assert 'devices' in data
        assert isinstance(data['devices'], list)
        assert 'total' in data
        assert 'page' in data

    def test_create_device_success(self, api_client):
        """测试创建设备 - 成功场景"""
        device_data = {
            'name': 'Test-Switch-001',
            'ip_address': '192.168.1.201',
            'device_type': 'switch',
            'snmp_community': 'public',
            'location': 'Building A - Floor 1'
        }

        response = api_client.create_device(device_data)

        assert response.status_code == 201
        created_device = response.json()
        assert created_device['name'] == device_data['name']
        assert created_device['ip_address'] == device_data['ip_address']
        assert 'device_id' in created_device

    def test_create_device_invalid_ip(self, api_client):
        """测试创建设备 - 无效IP地址"""
        invalid_device = {
            'name': 'Test-Switch-002',
            'ip_address': '999.999.999.999',  # 无效IP
            'device_type': 'switch'
        }

        response = api_client.create_device(invalid_device)

        assert response.status_code == 400
        error = response.json()
        assert 'error' in error
        assert 'ip_address' in error['error'].lower()

    def test_device_config_update(self, api_client):
        """测试设备配置更新"""
        # 先创建设备
        device_data = {
            'name': 'Test-Router-001',
            'ip_address': '192.168.1.202',
            'device_type': 'router'
        }
        create_response = api_client.create_device(device_data)
        device_id = create_response.json()['device_id']

        # 更新配置
        config_update = {
            'snmp_community': 'private',
            'snmp_version': '2c',
            'description': 'Updated via API test'
        }

        update_response = api_client.update_device_config(device_id, config_update)

        assert update_response.status_code == 200
        updated_device = update_response.json()
        assert updated_device['snmp_community'] == 'private'
```

## 🌐 GUI自动化测试

### Selenium WebDriver实战
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import pytest

class NetworkManagementGUI:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def login(self, username, password):
        """登录网管系统"""
        self.driver.get("http://192.168.1.100:8080")

        # 等待登录表单加载
        username_field = self.wait.until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        password_field = self.driver.find_element(By.ID, "password")
        login_button = self.driver.find_element(By.ID, "login-btn")

        # 输入凭据
        username_field.clear()
        username_field.send_keys(username)
        password_field.clear()
        password_field.send_keys(password)

        # 点击登录
        login_button.click()

        # 验证登录成功
        self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "dashboard"))
        )

    def navigate_to_device_management(self):
        """导航到设备管理页面"""
        device_menu = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(),'Device Management')]"))
        )
        device_menu.click()

        # 等待页面加载
        self.wait.until(
            EC.presence_of_element_located((By.ID, "device-table"))
        )

    def add_new_device(self, device_info):
        """添加新设备"""
        # 点击添加按钮
        add_button = self.driver.find_element(By.ID, "add-device-btn")
        add_button.click()

        # 等待弹窗加载
        modal = self.wait.until(
            EC.presence_of_element_located((By.ID, "device-modal"))
        )

        # 填写设备信息
        self.driver.find_element(By.ID, "device-name").send_keys(device_info['name'])
        self.driver.find_element(By.ID, "device-ip").send_keys(device_info['ip'])

        # 选择设备类型
        device_type_select = self.driver.find_element(By.ID, "device-type")
        device_type_select.click()
        type_option = self.driver.find_element(
            By.XPATH, f"//option[@value='{device_info['type']}']"
        )
        type_option.click()

        # 保存设备
        save_button = self.driver.find_element(By.ID, "save-device-btn")
        save_button.click()

        # 等待成功消息
        success_message = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
        return success_message.text
```

### GUI测试用例
```python
class TestNetworkManagementGUI:
    @pytest.fixture
    def driver(self):
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')  # 无头模式，适用于CI/CD
        driver = webdriver.Chrome(options=options)
        yield driver
        driver.quit()

    @pytest.fixture
    def gui_client(self, driver):
        return NetworkManagementGUI(driver)

    def test_login_success(self, gui_client):
        """测试登录成功"""
        gui_client.login('admin', 'password123')

        # 验证登录后的页面元素
        dashboard = gui_client.driver.find_element(By.CLASS_NAME, "dashboard")
        assert dashboard.is_displayed()

        welcome_text = gui_client.driver.find_element(By.ID, "welcome-message")
        assert "Welcome, admin" in welcome_text.text

    def test_add_device_workflow(self, gui_client):
        """测试添加设备完整流程"""
        # 登录
        gui_client.login('admin', 'password123')

        # 导航到设备管理
        gui_client.navigate_to_device_management()

        # 添加新设备
        device_info = {
            'name': 'GUI-Test-Switch',
            'ip': '192.168.1.203',
            'type': 'switch'
        }

        success_message = gui_client.add_new_device(device_info)
        assert "Device added successfully" in success_message

        # 验证设备出现在列表中
        device_table = gui_client.driver.find_element(By.ID, "device-table")
        table_text = device_table.text
        assert device_info['name'] in table_text
        assert device_info['ip'] in table_text
```

## 🎯 网络设备特定测试场景

### SNMP接口测试
```python
def test_snmp_configuration_api(api_client):
    """测试SNMP配置接口"""
    device_id = "switch-001"
    snmp_config = {
        'version': 'v2c',
        'community': 'public',
        'port': 161,
        'timeout': 5,
        'retries': 3
    }

    response = api_client.update_device_snmp_config(device_id, snmp_config)

    assert response.status_code == 200

    # 验证配置生效
    get_response = api_client.get_device_config(device_id)
    config = get_response.json()['snmp']
    assert config['version'] == 'v2c'
    assert config['community'] == 'public'
```

### NETCONF接口测试
```python
def test_netconf_connection(api_client):
    """测试NETCONF连接配置"""
    device_id = "router-001"
    netconf_config = {
        'enabled': True,
        'port': 830,
        'username': 'netconf_user',
        'password': 'netconf_pass',
        'ssh_hostkey_verify': False
    }

    response = api_client.configure_netconf(device_id, netconf_config)

    assert response.status_code == 200

    # 测试连接
    test_response = api_client.test_netconf_connection(device_id)
    assert test_response.json()['connection_status'] == 'success'
```

## 📊 性能与负载测试

### API性能测试
```python
import time
import concurrent.futures
import statistics

def test_api_performance():
    """API性能基准测试"""
    api_client = NetworkDeviceAPI('http://192.168.1.100:8080', 'admin', 'password')

    def make_request():
        start_time = time.time()
        response = api_client.get_devices()
        end_time = time.time()
        return {
            'status_code': response.status_code,
            'response_time': end_time - start_time
        }

    # 并发测试
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request) for _ in range(100)]
        results = [future.result() for future in concurrent.futures.as_completed(futures)]

    # 分析结果
    response_times = [result['response_time'] for result in results]
    success_count = sum(1 for result in results if result['status_code'] == 200)

    print(f"Success Rate: {success_count/len(results)*100:.2f}%")
    print(f"Average Response Time: {statistics.mean(response_times):.3f}s")
    print(f"95th Percentile: {statistics.quantiles(response_times, n=20)[18]:.3f}s")

    assert success_count / len(results) >= 0.99  # 99%成功率
    assert statistics.mean(response_times) < 1.0  # 平均响应时间<1s
```

## 🔧 测试环境搭建

### Docker测试环境
```yaml
# docker-compose.yml
version: '3.8'
services:
  network-management:
    image: network-mgmt:latest
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: network_mgmt
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password

  redis:
    image: redis:6-alpine
```

### 测试数据管理
```python
# conftest.py
import pytest
import json

@pytest.fixture(scope="session")
def test_data():
    """加载测试数据"""
    with open('test_data.json', 'r') as f:
        return json.load(f)

@pytest.fixture(autouse=True)
def setup_and_cleanup(api_client):
    """测试前后的数据清理"""
    # Setup: 创建测试所需的基础数据
    yield
    # Cleanup: 清理测试产生的数据
    api_client.cleanup_test_data()
```

---

## 🎯 面试重点总结

### 实战经验准备
1. **API测试深度**：认证机制、错误处理、性能测试
2. **GUI自动化经验**：Selenium/Cypress/Playwright选型与实践
3. **网络设备特色**：SNMP/NETCONF接口测试经验
4. **测试策略**：端到端测试设计、测试环境管理

### 常见面试问题
- **API测试vs GUI测试**：优缺点、适用场景、测试策略
- **自动化测试框架设计**：分层架构、数据驱动、关键字驱动
- **性能测试方法**：负载测试、压力测试、基准测试
- **CI/CD集成**：测试流水线设计、测试报告、失败分析

*准备建议：结合具体项目经验，能够详细描述测试场景、遇到的问题及解决方案*