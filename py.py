import json
import sys

# read from file
file_name = sys.argv[1]
file_object = open(file_name)
all_the_text = ''
try:
     all_the_text = file_object.read( )
finally:
     file_object.close( )

charset = sys.argv[2]
if charset.strip():
    all_the_text = all_the_text.decode(charset, 'ignore').encode('utf-8')

#add to json
oriStr = '{"n":1,"ad":[{"act":1,"title":""}]}'
decodejson = json.loads(oriStr)
decodejson["ad"][0]["html"]=all_the_text;

#print out
encodedjson = json.dumps(all_the_text, sort_keys=True, indent=4, separators=(',', ': '))
file_object = open(file_name + '.out.txt', 'w')
file_object.write(encodedjson)
file_object.close( )