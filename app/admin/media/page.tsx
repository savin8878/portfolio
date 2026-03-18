import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MediaLibrary } from "@/components/admin/media-library"

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Media Library</h2>
        <p className="text-muted-foreground">
          Upload and manage images and files for your portfolio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>
            Drag and drop files to upload, or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaLibrary />
        </CardContent>
      </Card>
    </div>
  )
}
