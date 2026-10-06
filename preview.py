from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re,os
ROOT=Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def send_head(self):
  self.byte_range=None
  path=Path(self.translate_path(self.path));header=self.headers.get('Range')
  if header and path.is_file():
   size=path.stat().st_size;m=re.fullmatch(r'bytes=(\d*)-(\d*)',header)
   if m and size:
    start=int(m[1]) if m[1] else max(0,size-int(m[2] or size));end=min(int(m[2]),size-1) if m[1] and m[2] else size-1
    if start>=size or start>end:
     self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.send_header('Content-Length','0');self.end_headers();return None
    f=path.open('rb');f.seek(start);self.byte_range=(start,end)
    self.send_response(206);self.send_header('Content-Type',self.guess_type(str(path)));self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Content-Length',str(end-start+1));self.send_header('Accept-Ranges','bytes');self.end_headers();return f
  return super().send_head()
 def copyfile(self,source,outputfile):
  try:
   if self.byte_range:
    left=self.byte_range[1]-self.byte_range[0]+1
    while left:
     data=source.read(min(left,1024*1024))
     if not data:break
     outputfile.write(data);left-=len(data)
   else:super().copyfile(source,outputfile)
  except (BrokenPipeError,ConnectionResetError):pass
print('Portfolio preview: http://127.0.0.1:8766',flush=True)
ThreadingHTTPServer(('127.0.0.1',8766),Handler).serve_forever()
