$files = Get-ChildItem -Path "C:\Users\Administrator\Desktop\千早爱音给我助教\Gojica2.0\Gojica2.0前端\pages" -Filter "*.uvue" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    $openTemplate = ([regex]::Matches($content, '<template>')).Count
    $closeTemplate = ([regex]::Matches($content, '</template>')).Count
    
    $openScript = ([regex]::Matches($content, '<script[^>]*>')).Count
    $closeScript = ([regex]::Matches($content, '</script>')).Count
    
    $openStyle = ([regex]::Matches($content, '<style[^>]*>')).Count
    $closeStyle = ([regex]::Matches($content, '</style>')).Count
    
    $problems = @()
    
    if ($openTemplate -ne $closeTemplate) {
        $problems += "template: $openTemplate/$closeTemplate"
    }
    if ($openScript -ne $closeScript) {
        $problems += "script: $openScript/$closeScript"
    }
    if ($openStyle -ne $closeStyle) {
        $problems += "style: $openStyle/$closeStyle"
    }
    
    if ($problems.Count -gt 0) {
        Write-Host "$($file.Name): $($problems -join ', ')" -ForegroundColor Red
    }
}
