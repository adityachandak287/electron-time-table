import os
import json

raw_data = open("tt.txt").readlines()
slots = dict()
timings = dict()

days = "mon tue wed thu fri sat sun".split(" ")
ignore_words = "theory lab lunch".split(" ")

current_component = ""
for line in raw_data[:4]:
    cols = line.strip().split("\t")
    current = ""
    col_ind = 0
    for col in cols:
        cell = col.lower()
        if cell in ["theory", "lab"]:
            current_component = col.lower()
            timings[current_component] = list()
        elif cell in ["start", "end"]:
            current = cell
            # timings[current_component][current] = list()
        else:
            if current == "start":
                timings[current_component].append({current: cell})
            else:
                timings[current_component][col_ind][current] = cell
            col_ind += 1

# print(json.dumps(timings, indent=4))
# print(len(timings["theory"]))
# print(len(timings["lab"]))
# exit()


current_day = ""
current_component = ""
for line in raw_data[4:]:
    cols = line.strip().split("\t")
    ind_offset = 0
    for col_ind, col in enumerate(cols):
        cell = col.lower()
        if cell in days:
            slots[cell] = dict()
            current_day = cell
        if cell in ["theory", "lab"]:
            current_component = col.lower()
            slots[current_day][current_component] = list()
            ind_offset = col_ind+1
            # print(ind_offset)
        if cell not in ignore_words:
            index = col_ind - ind_offset
            info = col.split("-")
            slot = info[0]
            if len(info) > 1 and slot != "":
                # A1-ITE3001-ETH-SJT105
                course_code, _, location = info[1:]
                start, end = timings[current_component][index].values()
                slots[current_day][current_component].append({
                    "slot": slot,
                    "course_code": course_code,
                    "course_name": "course_name",
                    "location": location,
                    "start": start,
                    "end": end
                })

with open("tt.json", "w") as outfile:
    outfile.write(json.dumps(slots, indent=4))

with open("timings.json", "w") as outfile:
    outfile.write(json.dumps(timings, indent=4))


'''
timings
{
    "theory": [{
        "start": ___,
        "end": ___
    },
    {
        "start": ___,
        "end": ___
    }],
    "lab": [{
        "start": ___,
        "end": ___
    },
    {
        "start": ___,
        "end": ___
    }],
}

'''

'''
slots
{
    "mon":  {
        "theory":   [
            {
                "slot": "A1",
                "course_code": "_______",
                "course_name": "_______",
                "location": "______",
                "start": "__:__",
                "end": "__:__"
            },
            ...
        ],
        "lab":  [
            {
                "slot": "L1",
                "course_code": "_______",
                "course_name": "_______",
                "location": "______",
                "start": "__:__",
                "end": "__:__"
            },
            ...
        ]
    }
}
'''
