# Local preview of dist-site WITH the production security headers (from vercel.json)
# applied — so we can verify CSP doesn't break the page before/while it's live.
require 'webrick'
require 'json'

ROOT = '/Users/waleed/kinetic-guard/dist-site'
HEADERS = JSON.parse(File.read(File.join(ROOT, 'vercel.json')))['headers'][0]['headers']

server = WEBrick::HTTPServer.new(
  Port: 4602, DocumentRoot: ROOT,
  AccessLog: [], Logger: WEBrick::Log.new($stderr)
)

# cleanUrls emulation: /features → /features.html
server.mount_proc '/' do |req, res|
  path = req.path
  fp = File.join(ROOT, path)
  fp = File.join(fp, 'index.html') if File.directory?(fp)
  fp = "#{fp}.html" if !File.file?(fp) && File.file?("#{fp}.html")
  if File.file?(fp)
    res.body = File.binread(fp)
    res.content_type = case File.extname(fp)
      when '.html' then 'text/html; charset=utf-8'
      when '.css'  then 'text/css'
      when '.js'   then 'application/javascript'
      when '.svg'  then 'image/svg+xml'
      when '.woff2' then 'font/woff2'
      when '.jpg', '.jpeg' then 'image/jpeg'
      when '.png'  then 'image/png'
      else 'application/octet-stream' end
  else
    res.status = 404; res.body = 'not found'
  end
  HEADERS.each { |h| res[h['key']] = h['value'] }
end

trap('INT') { server.shutdown }
server.start
