/**
 * Helper
 *
 * @package     Monster Hunter Rise - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHRCalculator
 */

// Load Libraries
import md5 from 'md5'
import * as fs from 'fs'
import * as path from 'path'
import * as http from 'http'
import * as https from 'https'
import * as cheerio from 'cheerio'

function isEmpty(variable) {
    return (undefined === variable || null === variable)
}

function isNotEmpty(variable) {
    return (undefined !== variable && null !== variable)
}

function isObject(value) {
    if (true === isEmpty(value)) {
        return false
    }

    return 'object' === typeof value && false === Array.isArray(value)
}

function isArray(value) {
    if (true === isEmpty(value)) {
        return false
    }

    return 'object' === typeof value && true === Array.isArray(value)
}

function isFunction(value) {
    if (true === isEmpty(value)) {
        return false
    }

    return 'function' === typeof value
}

function isString(value) {
    if (true === isEmpty(value)) {
        return false
    }

    return 'string' === typeof value
}

function isNumber(value) {
    if (true === isEmpty(value)) {
        return false
    }

    return 'number' === typeof value
}

function isBoolean(value) {
    if (true === isEmpty(value)) {
        return false
    }

    return 'boolean' === typeof value
}

function checkType(value) {
    if (true === isEmpty(value)) {
        return null
    }

    if (true === isObject(value)) {
        return 'object'
    }

    if (true === isArray(value)) {
        return 'array'
    }

    if (true === isFunction(value)) {
        return 'function'
    }

    if (true === isString(value)) {
        return 'string'
    }

    if (true === isNumber(value)) {
        return 'number'
    }

    if (true === isBoolean(value)) {
        return 'boolean'
    }
}

function deepCopy(data) {
    return JSON.parse(JSON.stringify(data))
}

function jsonHash(data) {
    return md5(JSON.stringify(data))
}

const userAgentList = [
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; fr; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/42.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:47.0) Gecko/20100101 Firefox/47.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.13'
]

function fetchHtml(url) {
    if (isEmpty(url)) {
        return null
    }

    let cacheRoot = `${global.root}/temp/cache/html`
    let cacheName = md5(url)
    let cachePath = `${cacheRoot}/${cacheName}`

    // Load From Cache
    if (true === fs.existsSync(cachePath)) {
        return fs.readFileSync(cachePath, 'utf8')
    }

    // Save To Cache
    function saveCache(html) {
        if (false === fs.existsSync(path.dirname(cachePath))) {
            fs.mkdirSync(path.dirname(cachePath), {
                recursive: true
            })
        }

        fs.writeFileSync(cachePath, html)
    }

    let urlObject = new URL(url)

    return new Promise((resolve, reject) => {
        let handler = ('https:' === urlObject.protocol) ? https : http
        let userAgent = userAgentList[parseInt(Math.floor(Math.random() * userAgentList.length), 10)] // Random UA

        handler.get(url, {
            headers: {
                'User-Agent': userAgent
            }
        }, async (res) => {
            const { statusCode } = res

            if (statusCode !== 200) {
                if (301 === statusCode || 302 === statusCode) {
                    let html = await fetchHtml(res.headers.location)

                    saveCache(html)
                    resolve(html)
                } else {
                    resolve(null)
                }

                return
            }

            res.setEncoding('utf8')

            let html = ''

            res.on('data', (chunk) => {
                html += chunk
            })

            res.on('end', () => {
                saveCache(html)
                resolve(html)
            })
        }).on('error', (err) => {
            reject(err)
        })
    })
}

async function fetchHtmlAsDom(url) {
    let html = await fetchHtml(url)

    if (null === html) {
        return null
    }

    return cheerio.load(html)
}

function loadJSON(subPath) {
    let filePath = `${global.root}/${subPath}`

    if (false === fs.existsSync(filePath)) {
        return null
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function saveJSON(subPath, data) {
    let filePath = `${global.root}/${subPath}`

    if (false === fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), {
            recursive: true
        })
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4))

    return true
}

function loadCSV(subPath) {
    let filePath = `${global.root}/${subPath}`

    if (false === fs.existsSync(filePath)) {
        return null
    }

    return fs.readFileSync(filePath, 'utf8').split('\n').map((row) => {
        let newRow = []

        while (true) {
            let match = row.match(/^(\".*?\"|.*?)(?:\,((?:\".*?\"|.*?)(?:\,(?:\".*?\"|.*?))*))?$/)

            if (isEmpty(match)) {
                break
            }

            newRow.push(match[1].replace(/^\"/, '').replace(/\"$/, ''))

            if ('' === match[2] || isEmpty(match[2])) {
                if ('' === match[2]) {
                    newRow.push('')
                }

                break
            }

            row = match[2]
        }

        return newRow
    })
}

function saveCSV(subPath, data) {
    let filePath = `${global.root}/${subPath}`

    if (false === fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), {
            recursive: true
        })
    }

    fs.writeFileSync(filePath, data.map((row) => {
        return row.map((col) => {
            return isNotEmpty(col) && ('' !== col) ? `"${col}"` : col
        }).join(',')
    }).join('\n'))

    return true
}

function loadCSVAsJSON(subPath) {
    const recursive = (segments, value, lastType, mapping) => {
        segments = deepCopy(segments)

        let segment = segments.shift()

        if ('array' === lastType) {
            segment.name = parseInt(segment.name, 10)
        }

        if ('object' === segment.type) {
            if (isEmpty(mapping[segment.name])) {
                mapping[segment.name] = {}
            }

            mapping[segment.name] = recursive(segments, value, 'object', mapping[segment.name])

            return mapping
        }

        if ('array' === segment.type) {
            if (isEmpty(mapping[segment.name])) {
                mapping[segment.name] = []
            }

            mapping[segment.name] = recursive(segments, value, 'array', mapping[segment.name])

            return mapping
        }

        if ('null' === segment.type || 'string' === segment.type) {
            mapping[segment.name] = (null !== value && '' !== value)
                ? value : null

            return mapping
        }

        if ('number' === segment.type) {
            mapping[segment.name] = (null !== value && '' !== value)
                ? parseFloat(value) : null

            return mapping
        }

        if ('boolean' === segment.type) {
            mapping[segment.name] = (null !== value && '' !== value)
                ? ('true' === value) : null

            return mapping
        }
    }

    // Load File
    let structuredCSV = loadCSV(subPath)

    if (isEmpty(structuredCSV)) {
        return null
    }

    // Parse Header Keys
    let header = structuredCSV.shift()

    header = header.map((head) => {
        if (false === /^\<\w+\>(?:\:(?:\{\w+\}|\[\w+\]|\w+))+$/.test(head)) {
            throw 'Head is Illegal'
        }

        let segments = head.split(':')
        let type = segments.shift().match(/^\<(\w+)\>$/)[1]

        return segments.map((key) => {
            let match = null

            match = key.match(/^\{(\w+)\}$/)

            if (isNotEmpty(match)) {
                return {
                    type: 'object',
                    name: match[1]
                }
            }

            match = key.match(/^\[(\w+)\]$/)

            if (isNotEmpty(match)) {
                return {
                    type: 'array',
                    name: match[1]
                }
            }

            match = key.match(/^(\w+)$/)

            if (isNotEmpty(match)) {
                return {
                    type: type,
                    name: match[1]
                }
            }

            throw 'Key is Illegal'
        })
    })

    return structuredCSV.map((data) => {
        let mapping = {}

        data.forEach((value, index) => {
            mapping = recursive(header[index], value, 'object', mapping)
        })

        return mapping
    })
}

function saveJSONAsCSV(subPath, data) {
    const recursive = (key, value, allKeys, keyTypeMapping, keyDataMapping) => {
        if (true === isFunction(value)) {
            throw 'is not allowed type'
        }

        allKeys = deepCopy(allKeys)

        if (true === isObject(value)) {
            if (true === isNotEmpty(key)) {
                allKeys.push(`{${key}}`)
            }

            for (let entry of Object.entries(value)) {
                let result = recursive(entry[0], entry[1], allKeys, keyTypeMapping, keyDataMapping)

                keyTypeMapping = result.keyTypeMapping
                keyDataMapping = result.keyDataMapping
            }

            return { keyTypeMapping, keyDataMapping }
        }

        if (true === isArray(value)) {
            if (true === isNotEmpty(key)) {
                allKeys.push(`[${key}]`)
            }

            for (let entry of Object.entries(value)) {
                let result = recursive(entry[0], entry[1], allKeys, keyTypeMapping, keyDataMapping)

                keyTypeMapping = result.keyTypeMapping
                keyDataMapping = result.keyDataMapping
            }

            return { keyTypeMapping, keyDataMapping }
        }

        if (true === isEmpty(value)
            || true === isString(value)
            || true === isNumber(value)
        ) {
            if (true === isNotEmpty(key)) {
                allKeys.push(key)
            }

            let currentKey = allKeys.join(':')

            if (isEmpty(keyTypeMapping[currentKey])) {
                keyTypeMapping[currentKey] = checkType(value)
            }

            keyDataMapping[currentKey] = value

            return { keyTypeMapping, keyDataMapping }
        }

        if (true === isBoolean(value)) {
            if (true === isNotEmpty(key)) {
                allKeys.push(key)
            }

            let currentKey = allKeys.join(':')

            if (isEmpty(keyTypeMapping[currentKey])) {
                keyTypeMapping[currentKey] = checkType(value)
            }

            keyDataMapping[currentKey] = value ? 'true' : 'false'

            return { keyTypeMapping, keyDataMapping }
        }
    }

    // Flat Nested Format as XY Dimension
    let keyTypeMapping = {}
    let keyDataMappings = []

    data.forEach((item) => {
        let keyDataMapping = {}
        let result = recursive(null, item, [], keyTypeMapping, keyDataMapping)

        keyTypeMapping = result.keyTypeMapping
        keyDataMapping = result.keyDataMapping

        keyDataMappings.push(keyDataMapping)
    })

    // Convert XY Dimension for CSV Format
    let structuredCSV = []

    structuredCSV.push(Object.entries(keyTypeMapping).map((entry) => {
        return `<${entry[1]}>:${entry[0]}`
    }))

    keyDataMappings.forEach((keyDataMapping) => {
        structuredCSV.push(Object.keys(keyTypeMapping).map((key) => {
            return isNotEmpty(keyDataMapping[key]) ? keyDataMapping[key] : ''
        }))
    })

    // Save File
    saveCSV(subPath, structuredCSV)

    return true
}

function cleanFolder(subPath) {
    let filePath = `${global.root}/${subPath}`

    if (true === fs.existsSync(path.dirname(filePath))) {
        fs.rmdirSync(filePath, {
            recursive: true
        })
    }
}

export default {
    isEmpty,
    isNotEmpty,
    isObject,
    isArray,
    isFunction,
    isString,
    isNumber,
    isBoolean,
    checkType,
    deepCopy,
    jsonHash,
    fetchHtml,
    fetchHtmlAsDom,
    loadJSON,
    saveJSON,
    loadCSV,
    saveCSV,
    loadCSVAsJSON,
    saveJSONAsCSV,
    cleanFolder
}
