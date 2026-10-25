$port = 8080
$root = "D:\studio-automic"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:$port/")
try {
    $listener.Start()
} catch {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

Write-Output "HTTP Server running on http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $urlPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }
        $urlPath = [System.Uri]::UnescapeDataString($urlPath)
        $fullPath = Join-Path $root $urlPath

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            switch ($ext) {
                ".html" { $res.ContentType = "text/html; charset=utf-8" }
                ".css"  { $res.ContentType = "text/css; charset=utf-8" }
                ".js"   { $res.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $res.ContentType = "application/json; charset=utf-8" }
                ".png"  { $res.ContentType = "image/png" }
                ".jpg"  { $res.ContentType = "image/jpeg" }
                ".svg"  { $res.ContentType = "image/svg+xml" }
                ".mp4"  { $res.ContentType = "video/mp4" }
                default { $res.ContentType = "application/octet-stream" }
            }

            # 캐시 방지 (개발 중 즉시 반영)
            $res.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            $res.AddHeader("Accept-Ranges", "bytes")

            $fileInfo = New-Object System.IO.FileInfo($fullPath)
            $totalLength = $fileInfo.Length

            # 동영상 Range 요청 처리
            $rangeHeader = $req.Headers["Range"]
            if ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
                $range = $rangeHeader.Substring(6).Split('-')
                $start = [int64]$range[0]
                $end = if (![string]::IsNullOrEmpty($range[1])) { [int64]$range[1] } else { $totalLength - 1 }
                if ($end -ge $totalLength) { $end = $totalLength - 1 }
                $chunkLen = $end - $start + 1

                $res.StatusCode = 206
                $res.AddHeader("Content-Range", "bytes $start-$end/$totalLength")
                $res.ContentLength64 = $chunkLen

                $stream = [System.IO.File]::OpenRead($fullPath)
                try {
                    [void]$stream.Seek($start, [System.IO.SeekOrigin]::Begin)
                    $buf = New-Object byte[] 65536
                    $remaining = $chunkLen
                    while ($remaining -gt 0) {
                        $toRead = [Math]::Min($buf.Length, $remaining)
                        $read = $stream.Read($buf, 0, $toRead)
                        if ($read -le 0) { break }
                        $res.OutputStream.Write($buf, 0, $read)
                        $remaining -= $read
                    }
                } finally {
                    $stream.Close()
                }
            } else {
                $res.StatusCode = 200
                $res.ContentLength64 = $totalLength
                $stream = [System.IO.File]::OpenRead($fullPath)
                try {
                    $buf = New-Object byte[] 65536
                    while (($read = $stream.Read($buf, 0, $buf.Length)) -gt 0) {
                        $res.OutputStream.Write($buf, 0, $read)
                    }
                } finally {
                    $stream.Close()
                }
            }
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
    } catch {
        # 브라우저 요청 중단 무시
    } finally {
        try { $res.OutputStream.Flush() } catch {}
        try { $res.OutputStream.Close() } catch {}
        try { $res.Close() } catch {}
    }
}
