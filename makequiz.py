import json

data = ""
with open("test.json") as f:
    data = json.loads(f.read())

entries_to_remove = ('id', 
                            'description', 
                            'multiple_correct_answers', 
                            "correct_answer", 
                            "explanation",
                            "tip",
                            "tags",
                            "category",
                            "difficulty")

strings_to_remove = ['kubernetes', 'Minikube']


for dict in data.copy():
    for _ in strings_to_remove:
        if _ in dict['question']:
            data.remove(dict)
    for k in entries_to_remove:
        data.pop(k, None)
        # print(i)

print("Questions:", len(data))
with open("output.json", "w") as outfile:
    json.dump(data, outfile)