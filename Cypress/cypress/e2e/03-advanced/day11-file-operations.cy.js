/**
 * 📁 Day 11: 文件操作
 *
 * 学习目标：
 * - 掌握 cy.readFile() 和 cy.writeFile()
 * - 学习文件上传测试
 * - 学习文件下载验证
 * - 处理各种文件类型
 * - 学习文件系统集成测试
 */

describe('📁 Day 11: 文件操作', () => {

  beforeEach(() => {
    // 访问文件操作示例页面
    cy.visit('https://example.cypress.io/commands/files')
  })

  describe('📖 文件读取操作', () => {

    it('应该能够读取 JSON 文件', () => {
      // 🎯 学习要点：读取 JSON 数据文件
      cy.readFile('cypress/fixtures/users.json').then((users) => {
        expect(users).to.be.an('array')
        expect(users).to.have.length.greaterThan(0)

        // 使用文件数据进行测试
        const firstUser = users[0]
        expect(firstUser).to.have.property('name')
        expect(firstUser).to.have.property('email')

        cy.log(`读取到 ${users.length} 个用户数据`)
        cy.log(`第一个用户: ${firstUser.name}`)
      })
    })

    it('应该能够读取文本文件', () => {
      // 🎯 学习要点：读取纯文本文件
      cy.writeFile('cypress/temp/test.txt', 'Hello, Cypress!')

      cy.readFile('cypress/temp/test.txt').then((content) => {
        expect(content).to.eq('Hello, Cypress!')
        cy.log(`文件内容: ${content}`)
      })
    })

    it('应该能够读取 CSV 文件', () => {
      // 🎯 学习要点：处理 CSV 数据
      const csvData = `name,age,email
Alice,30,alice@example.com
Bob,25,bob@example.com
Charlie,35,charlie@example.com`

      cy.writeFile('cypress/temp/users.csv', csvData)

      cy.readFile('cypress/temp/users.csv').then((content) => {
        const lines = content.split('\\n')
        const headers = lines[0].split(',')
        const dataRows = lines.slice(1)

        expect(headers).to.deep.equal(['name', 'age', 'email'])
        expect(dataRows).to.have.length(3)

        // 解析 CSV 数据
        const users = dataRows.map(row => {
          const values = row.split(',')
          return {
            name: values[0],
            age: parseInt(values[1]),
            email: values[2]
          }
        })

        cy.log(`解析出 ${users.length} 个用户`)
        users.forEach(user => {
          cy.log(`${user.name}, ${user.age}, ${user.email}`)
        })
      })
    })

    it('应该能够读取二进制文件', () => {
      // 🎯 学习要点：处理二进制文件
      cy.readFile('cypress/fixtures/images/sample.png', 'base64').then((base64) => {
        expect(base64).to.be.a('string')
        expect(base64).to.match(/^[A-Za-z0-9+/]+=*$/)

        cy.log(`图片 Base64 长度: ${base64.length}`)
      })
    })
  })

  describe('✍️ 文件写入操作', () => {

    it('应该能够写入 JSON 文件', () => {
      // 🎯 学习要点：写入结构化数据
      const testData = {
        timestamp: Date.now(),
        testResults: {
          passed: 15,
          failed: 2,
          skipped: 1
        },
        environment: 'staging'
      }

      cy.writeFile('cypress/temp/test-results.json', testData)

      // 验证写入的文件
      cy.readFile('cypress/temp/test-results.json').then((data) => {
        expect(data).to.deep.equal(testData)
        expect(data.testResults.passed).to.eq(15)
      })
    })

    it('应该能够追加内容到文件', () => {
      // 🎯 学习要点：文件内容追加
      const logEntry1 = 'Test started at ' + new Date().toISOString()
      const logEntry2 = 'Test completed successfully'

      // 写入初始内容
      cy.writeFile('cypress/temp/test.log', logEntry1 + '\\n')

      // 读取现有内容并追加
      cy.readFile('cypress/temp/test.log').then((content) => {
        const updatedContent = content + logEntry2 + '\\n'
        cy.writeFile('cypress/temp/test.log', updatedContent)
      })

      // 验证追加结果
      cy.readFile('cypress/temp/test.log').then((content) => {
        expect(content).to.include(logEntry1)
        expect(content).to.include(logEntry2)
      })
    })

    it('应该能够生成测试报告文件', () => {
      // 🎯 学习要点：生成测试报告
      const reportData = {
        testSuite: 'File Operations',
        startTime: new Date().toISOString(),
        tests: [
          { name: 'Read JSON file', status: 'passed', duration: 150 },
          { name: 'Write JSON file', status: 'passed', duration: 89 },
          { name: 'Upload file', status: 'failed', duration: 2300, error: 'File too large' }
        ]
      }

      // 生成 HTML 报告
      const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - ${reportData.testSuite}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 10px; }
        .passed { color: green; }
        .failed { color: red; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <div class="header">
        <h1>测试报告: ${reportData.testSuite}</h1>
        <p>开始时间: ${reportData.startTime}</p>
    </div>
    <table>
        <tr><th>测试名称</th><th>状态</th><th>耗时</th><th>错误</th></tr>
        ${reportData.tests.map(test => `
            <tr>
                <td>${test.name}</td>
                <td class="${test.status}">${test.status}</td>
                <td>${test.duration}ms</td>
                <td>${test.error || ''}</td>
            </tr>
        `).join('')}
    </table>
</body>
</html>`

      cy.writeFile('cypress/temp/report.html', htmlReport)

      // 验证生成的报告
      cy.readFile('cypress/temp/report.html').then((content) => {
        expect(content).to.include(reportData.testSuite)
        expect(content).to.include('passed')
        expect(content).to.include('failed')
      })
    })
  })

  describe('📤 文件上传测试', () => {

    it('应该能够上传单个文件', () => {
      // 🎯 学习要点：基本文件上传
      cy.visit('https://the-internet.herokuapp.com/upload')

      // 选择文件进行上传
      cy.get('#file-upload').selectFile('cypress/fixtures/example.json')

      // 执行上传
      cy.get('#file-submit').click()

      // 验证上传成功
      cy.get('#uploaded-files').should('contain', 'example.json')
      cy.contains('File Uploaded!').should('be.visible')
    })

    it('应该能够上传多个文件', () => {
      // 🎯 学习要点：多文件上传
      cy.visit('https://the-internet.herokuapp.com/upload')

      const files = [
        'cypress/fixtures/example.json',
        'cypress/fixtures/users.json'
      ]

      // 选择多个文件
      cy.get('#file-upload').selectFile(files)

      cy.get('#file-submit').click()

      // 验证所有文件都上传成功
      files.forEach(file => {
        const filename = file.split('/').pop()
        cy.get('#uploaded-files').should('contain', filename)
      })
    })

    it('应该能够通过拖放上传文件', () => {
      // 🎯 学习要点：拖放文件上传
      cy.visit('https://the-internet.herokuapp.com/upload')

      // 使用拖放方式上传文件
      cy.get('#drag-drop-upload').selectFile('cypress/fixtures/example.json', {
        action: 'drag-drop'
      })

      // 验证文件已被选中
      cy.get('.dz-filename').should('contain', 'example.json')

      // 触发上传
      cy.get('.dz-upload').click()

      // 验证上传状态
      cy.get('.dz-success').should('be.visible')
    })

    it('应该能够上传不同类型的文件', () => {
      // 🎯 学习要点：多种文件格式上传
      const fileTypes = [
        { file: 'cypress/fixtures/example.json', type: 'application/json' },
        { file: 'cypress/fixtures/sample.txt', type: 'text/plain' },
        { file: 'cypress/fixtures/image.png', type: 'image/png' }
      ]

      cy.visit('https://the-internet.herokuapp.com/upload')

      fileTypes.forEach(({ file, type }) => {
        cy.get('#file-upload').selectFile({
          contents: file,
          mimeType: type
        })

        cy.get('#file-submit').click()

        const filename = file.split('/').pop()
        cy.get('#uploaded-files').should('contain', filename)

        // 重置页面进行下一次测试
        cy.reload()
      })
    })

    it('应该能够模拟文件上传内容', () => {
      // 🎯 学习要点：动态生成文件内容
      cy.visit('https://the-internet.herokuapp.com/upload')

      const dynamicContent = JSON.stringify({
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        testData: 'Generated by Cypress'
      }, null, 2)

      // 使用动态内容创建文件
      cy.get('#file-upload').selectFile({
        contents: Cypress.Buffer.from(dynamicContent),
        fileName: 'dynamic-test.json',
        mimeType: 'application/json'
      })

      cy.get('#file-submit').click()

      cy.get('#uploaded-files').should('contain', 'dynamic-test.json')
    })
  })

  describe('📥 文件下载测试', () => {

    it('应该能够验证文件下载', () => {
      // 🎯 学习要点：文件下载验证
      cy.visit('https://the-internet.herokuapp.com/download')

      // 触发文件下载
      cy.get('a[href*=".txt"]').first().click()

      // 验证文件已下载
      cy.readFile('cypress/downloads/some-file.txt').should('exist')
    })

    it('应该能够验证下载文件的内容', () => {
      // 🎯 学习要点：下载文件内容验证
      cy.visit('https://the-internet.herokuapp.com/download')

      cy.get('a[href*=".txt"]').first().click()

      // 验证下载文件内容
      cy.readFile('cypress/downloads/some-file.txt').then((content) => {
        expect(content).to.not.be.empty
        expect(content).to.be.a('string')
        cy.log(`下载文件大小: ${content.length} 字符`)
      })
    })

    it('应该能够处理 PDF 下载', () => {
      // 🎯 学习要点：PDF 文件处理
      cy.intercept('GET', '**/download/pdf', {
        statusCode: 200,
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'attachment; filename="report.pdf"'
        },
        body: 'PDF content placeholder'
      }).as('pdfDownload')

      cy.visit('https://example.cypress.io')

      // 模拟 PDF 下载链接点击
      cy.window().then((win) => {
        win.open('/download/pdf', '_blank')
      })

      cy.wait('@pdfDownload').then((interception) => {
        expect(interception.response.headers['content-type']).to.include('pdf')
      })
    })

    it('应该能够验证下载文件的大小', () => {
      // 🎯 学习要点：文件大小验证
      const expectedMinSize = 1000 // 字节
      const expectedMaxSize = 10000 // 字节

      cy.visit('https://the-internet.herokuapp.com/download')
      cy.get('a[href*=".txt"]').first().click()

      cy.readFile('cypress/downloads/some-file.txt', 'binary').then((content) => {
        const fileSize = content.length
        expect(fileSize).to.be.greaterThan(expectedMinSize)
        expect(fileSize).to.be.lessThan(expectedMaxSize)
        cy.log(`文件大小: ${fileSize} 字节`)
      })
    })
  })

  describe('🖼️ 图片和多媒体处理', () => {

    it('应该能够处理图片文件', () => {
      // 🎯 学习要点：图片文件操作
      cy.visit('https://example.cypress.io/commands/files')

      // 读取图片文件
      cy.readFile('cypress/fixtures/images/sample.png', 'base64').then((base64) => {
        // 验证是有效的 base64 图片数据
        expect(base64).to.match(/^[A-Za-z0-9+/]+=*$/)

        // 创建图片元素进行验证
        cy.window().then((win) => {
          const img = new win.Image()
          img.onload = () => {
            expect(img.width).to.be.greaterThan(0)
            expect(img.height).to.be.greaterThan(0)
            cy.log(`图片尺寸: ${img.width}x${img.height}`)
          }
          img.src = `data:image/png;base64,${base64}`
        })
      })
    })

    it('应该能够生成图片缩略图数据', () => {
      // 🎯 学习要点：图片处理和转换
      cy.readFile('cypress/fixtures/images/sample.png', 'base64').then((originalBase64) => {
        // 模拟图片处理（在实际场景中可能使用 canvas 或其他工具）
        const thumbnailData = {
          original: {
            base64: originalBase64,
            size: originalBase64.length
          },
          thumbnail: {
            width: 150,
            height: 150,
            generated: true
          },
          timestamp: Date.now()
        }

        // 保存处理结果
        cy.writeFile('cypress/temp/image-processing.json', thumbnailData)

        // 验证保存的数据
        cy.readFile('cypress/temp/image-processing.json').then((data) => {
          expect(data.thumbnail.width).to.eq(150)
          expect(data.thumbnail.generated).to.be.true
        })
      })
    })

    it('应该能够处理视频文件信息', () => {
      // 🎯 学习要点：多媒体文件元数据
      const videoMetadata = {
        filename: 'sample-video.mp4',
        duration: 120, // 秒
        resolution: '1920x1080',
        format: 'MP4',
        size: 15728640, // 字节
        created: new Date().toISOString()
      }

      cy.writeFile('cypress/temp/video-metadata.json', videoMetadata)

      // 验证视频元数据
      cy.readFile('cypress/temp/video-metadata.json').then((metadata) => {
        expect(metadata.duration).to.be.greaterThan(0)
        expect(metadata.resolution).to.include('x')
        expect(metadata.format).to.eq('MP4')

        cy.log(`视频时长: ${metadata.duration} 秒`)
        cy.log(`视频分辨率: ${metadata.resolution}`)
      })
    })
  })

  describe('🔧 高级文件操作', () => {

    it('应该能够批量处理文件', () => {
      // 🎯 学习要点：批量文件操作
      const fileList = [
        'file1.json',
        'file2.json',
        'file3.json'
      ]

      const processedFiles = []

      fileList.forEach((filename, index) => {
        const fileData = {
          id: index + 1,
          name: filename,
          content: `This is file ${index + 1}`,
          processed: true,
          timestamp: Date.now()
        }

        cy.writeFile(`cypress/temp/${filename}`, fileData)
        processedFiles.push(filename)
      })

      // 验证所有文件都已创建
      processedFiles.forEach((filename) => {
        cy.readFile(`cypress/temp/${filename}`).then((data) => {
          expect(data.processed).to.be.true
          cy.log(`✅ ${filename} 已处理`)
        })
      })

      // 创建批处理摘要
      const summary = {
        totalFiles: processedFiles.length,
        processedFiles,
        timestamp: Date.now()
      }

      cy.writeFile('cypress/temp/batch-summary.json', summary)
    })

    it('应该能够实现文件备份和恢复', () => {
      // 🎯 学习要点：文件备份策略
      const originalData = {
        version: '1.0.0',
        config: {
          theme: 'dark',
          language: 'zh-CN'
        }
      }

      // 写入原始文件
      cy.writeFile('cypress/temp/config.json', originalData)

      // 创建备份
      cy.readFile('cypress/temp/config.json').then((data) => {
        const backup = {
          ...data,
          backupTimestamp: Date.now(),
          backupVersion: 1
        }
        cy.writeFile('cypress/temp/config.backup.json', backup)
      })

      // 模拟文件损坏
      const corruptedData = { error: 'Data corrupted' }
      cy.writeFile('cypress/temp/config.json', corruptedData)

      // 从备份恢复
      cy.readFile('cypress/temp/config.backup.json').then((backup) => {
        const { backupTimestamp, backupVersion, ...originalData } = backup
        cy.writeFile('cypress/temp/config.json', originalData)
      })

      // 验证恢复成功
      cy.readFile('cypress/temp/config.json').then((data) => {
        expect(data.version).to.eq('1.0.0')
        expect(data.config.theme).to.eq('dark')
      })
    })

    it('应该能够处理大文件', () => {
      // 🎯 学习要点：大文件处理策略
      const largeDataArray = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        data: `Large dataset item ${index + 1}`,
        timestamp: Date.now() + index
      }))

      // 分块写入大文件
      const chunkSize = 100
      const chunks = []

      for (let i = 0; i < largeDataArray.length; i += chunkSize) {
        const chunk = largeDataArray.slice(i, i + chunkSize)
        chunks.push(chunk)
      }

      chunks.forEach((chunk, index) => {
        cy.writeFile(`cypress/temp/large-data-chunk-${index}.json`, chunk)
      })

      // 验证分块文件
      cy.readFile('cypress/temp/large-data-chunk-0.json').then((firstChunk) => {
        expect(firstChunk).to.have.length(chunkSize)
        expect(firstChunk[0].id).to.eq(1)
      })

      // 创建元数据
      const metadata = {
        totalItems: largeDataArray.length,
        chunks: chunks.length,
        chunkSize,
        created: Date.now()
      }

      cy.writeFile('cypress/temp/large-data-metadata.json', metadata)
    })
  })

  describe('🎯 实战练习', () => {

    it('🏆 练习：完整的文件管理系统', () => {
      // 模拟一个完整的文件管理场景
      const fileManager = {
        files: [],
        addFile: function(file) {
          this.files.push({
            ...file,
            id: this.files.length + 1,
            created: Date.now()
          })
        },
        getFile: function(id) {
          return this.files.find(f => f.id === id)
        },
        deleteFile: function(id) {
          this.files = this.files.filter(f => f.id !== id)
        }
      }

      // 添加文件
      const testFiles = [
        { name: 'document.pdf', size: 1024, type: 'application/pdf' },
        { name: 'image.jpg', size: 2048, type: 'image/jpeg' },
        { name: 'data.json', size: 512, type: 'application/json' }
      ]

      testFiles.forEach(file => fileManager.addFile(file))

      // 保存文件管理器状态
      cy.writeFile('cypress/temp/file-manager.json', fileManager)

      // 验证文件管理器
      cy.readFile('cypress/temp/file-manager.json').then((data) => {
        expect(data.files).to.have.length(3)

        data.files.forEach((file, index) => {
          expect(file).to.have.property('id')
          expect(file).to.have.property('created')
          expect(file.name).to.eq(testFiles[index].name)
        })
      })

      // 模拟文件删除
      fileManager.deleteFile(2)
      cy.writeFile('cypress/temp/file-manager.json', fileManager)

      cy.readFile('cypress/temp/file-manager.json').then((data) => {
        expect(data.files).to.have.length(2)
      })
    })
  })

  describe('💡 总结和最佳实践', () => {

    it('📚 文件操作最佳实践总结', () => {
      cy.then(() => {
        cy.log('📁 文件操作核心技能 ✅')
        cy.log('1. ✅ 文件读取 (JSON, Text, Binary)')
        cy.log('2. ✅ 文件写入和追加')
        cy.log('3. ✅ 文件上传测试 (单个/多个/拖放)')
        cy.log('4. ✅ 文件下载验证')
        cy.log('5. ✅ 图片和多媒体处理')
        cy.log('6. ✅ 批量文件操作')
        cy.log('7. ✅ 文件备份和恢复')
        cy.log('8. ✅ 大文件处理策略')

        cy.log('')
        cy.log('🎯 文件操作最佳实践:')
        cy.log('1. 💾 使用 fixtures 管理测试数据')
        cy.log('2. 🧹 测试后清理临时文件')
        cy.log('3. 📝 验证文件内容而非仅存在性')
        cy.log('4. 🔒 处理文件权限和错误场景')

        cy.log('')
        cy.log('📈 下一步学习：自定义命令和插件 (Day 12)')
        cy.log('🎯 重点：命令封装、参数化、复用性')
      })
    })

    it('🧹 清理测试文件', () => {
      // 清理测试过程中创建的临时文件
      const tempFiles = [
        'cypress/temp/test.txt',
        'cypress/temp/users.csv',
        'cypress/temp/test-results.json',
        'cypress/temp/test.log',
        'cypress/temp/report.html',
        'cypress/temp/config.json',
        'cypress/temp/config.backup.json',
        'cypress/temp/file-manager.json'
      ]

      cy.then(() => {
        cy.log('🧹 开始清理测试文件...')
      })

      // 注意：在实际项目中，你可能需要使用 cy.exec() 或其他方法来删除文件
      // 这里我们只是记录清理过程
      tempFiles.forEach(file => {
        cy.then(() => {
          cy.log(`清理文件: ${file}`)
        })
      })

      cy.then(() => {
        cy.log('✅ 文件清理完成')
      })
    })
  })
})

/**
 * 🌟 Day 11 学习要点总结：
 *
 * 1. **文件读取操作**
 *    - cy.readFile() 的各种用法
 *    - 处理不同文件格式 (JSON, CSV, Binary)
 *    - 文件编码处理
 *
 * 2. **文件写入操作**
 *    - cy.writeFile() 基础用法
 *    - 文件内容追加技巧
 *    - 动态内容生成
 *
 * 3. **文件上传测试**
 *    - 单文件和多文件上传
 *    - 拖放上传测试
 *    - 不同文件类型处理
 *
 * 4. **文件下载验证**
 *    - 下载完成性验证
 *    - 文件内容验证
 *    - 文件大小检查
 *
 * 5. **多媒体文件处理**
 *    - 图片文件 Base64 处理
 *    - 视频元数据管理
 *    - 文件转换和处理
 *
 * 6. **高级文件操作**
 *    - 批量文件处理
 *    - 文件备份策略
 *    - 大文件分块处理
 *
 * 💡 **实用技巧**：
 * - 合理组织 fixtures 目录结构
 * - 使用相对路径提高可移植性
 * - 处理文件操作的异步特性
 * - 实现文件操作的错误处理
 *
 * 🚀 **下一步**：掌握自定义命令和插件开发
 */