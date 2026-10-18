param(
    [string]$pptxPath = "",
    [string]$outPdf = "",
    [string]$outPngDir = ""
)

try {
    $ppt = New-Object -ComObject PowerPoint.Application
    $pres = $ppt.Presentations.Open($pptxPath, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    
    if ($outPdf -ne "") {
        # 32 = ppSaveAsPDF
        $pres.SaveAs($outPdf, 32)
        Write-Host "Exported PDF to $outPdf"
    }

    if ($outPngDir -ne "") {
        if (!(Test-Path $outPngDir)) { New-Item -ItemType Directory -Path $outPngDir | Out-Null }
        # 18 = ppSaveAsPNG
        $pres.SaveAs($outPngDir, 18)
        Write-Host "Exported PNG slides to $outPngDir"
    }

    $pres.Close()
    $ppt.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pres) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
} catch {
    Write-Error $_
}
