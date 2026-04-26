import pandas as pd
import numpy as np
import random
import os

# Ensure dataset directory exists
os.makedirs('../dataset', exist_ok=True)

# --- 1. Category Classification Dataset (120+ rows) ---
categories = ['medical', 'food', 'shelter', 'rescue', 'logistics', 'other']
templates = {
    'medical': [
        "Need oxygen cylinders for patient at {loc}",
        "Emergency first aid kit required for {num} injured",
        "Ambulance needed for heart attack victim",
        "Insulin and chronic medicine shortage in {loc}",
        "Doctor required for emergency surgery",
        "Surgical masks and gloves for clinic",
        "Clean water for cleaning wounds",
        "Suspected outbreak of fever in camp",
        "Vaccination drive for kids in relief center",
        "Patient with severe bleeding needs hospital transfer"
    ],
    'food': [
        "Dry rations and rice needed for {num} people",
        "Clean drinking water shortage in sector {loc}",
        "Baby food and milk powder for infants",
        "Community kitchen needs cooking oil",
        "Ready to eat meals for rescue teams",
        "Biscuits and protein bars for energy",
        "Fresh vegetables for nutrition",
        "Portable water tanks for distribution",
        "Emergency food supplies for isolated village",
        "Wheat flour and pulses for the camp"
    ],
    'shelter': [
        "Tents and blankets for displaced families",
        "Temporary roof covers for damaged homes",
        "Sleeping mats and bags for {num} people",
        "Need space in community hall for shelter",
        "Tarpaulin sheets for temporary roofing",
        "Portable toilets for relief camp",
        "Warm clothes for winter shelter",
        "Mosquito nets for outdoor sleepers",
        "Solar lamps for shelter lighting",
        "Hygiene kits and soap for camp"
    ],
    'rescue': [
        "People trapped in collapsed building at {loc}",
        "Flood rescue boats needed for stranded families",
        "Ropes and harnesses for mountain rescue",
        "Firefighters needed for warehouse fire",
        "Evacuation teams for coastal zone",
        "Ladders and cutting tools for rescue",
        "Sniffer dogs for search under debris",
        "Helicopter rescue for hilltop village",
        "Divers for river search operation",
        "Lifeguards for flooded streets"
    ],
    'logistics': [
        "Trucks needed to transport relief goods",
        "Forklifts for moving heavy crates",
        "Fuel for generators and vehicles",
        "Warehouse space for medicine storage",
        "Coordinators for volunteer management",
        "Satellite phones for communication",
        "Map data and GPS trackers",
        "Cargo planes unloading assistance",
        "Sorting facility for donated items",
        "Bus for evacuating senior citizens"
    ],
    'other': [
        "Cleaning supplies for community area",
        "Trash bags and waste management",
        "Psychological support for trauma victims",
        "Information desk for missing persons",
        "Stationery for data entry",
        "Power banks for volunteers",
        "Translators for international teams",
        "Legal advice for displaced families",
        "General labor for camp maintenance",
        "Board games for children in camp"
    ]
}

data1 = []
for cat in categories:
    for _ in range(25): # 6 * 25 = 150 rows
        tpl = random.choice(templates[cat])
        desc = tpl.format(loc=random.randint(1, 100), num=random.randint(5, 500))
        data1.append([desc, cat])

pd.DataFrame(data1, columns=['description', 'category']).to_csv('../dataset/needs_dataset.csv', index=False)

# --- 2. Urgency Score Dataset (150+ rows) ---
data2 = []
cat_weights = {'medical': 5, 'rescue': 5, 'shelter': 4, 'food': 3, 'logistics': 2, 'other': 1}

for _ in range(200):
    cat = random.choice(categories)
    affected = random.randint(1, 1000)
    tpl = random.choice(templates[cat])
    desc = tpl.format(loc=random.randint(1, 100), num=affected)
    
    # Logic: base + people weight
    base = cat_weights[cat]
    people_weight = min(5, affected // 100)
    score = base + people_weight
    if cat in ['medical', 'rescue']: score *= 1.2
    
    final_score = int(np.clip(round(score), 1, 10))
    data2.append([desc, affected, cat, final_score])

pd.DataFrame(data2, columns=['description', 'peopleAffected', 'category', 'urgencyScore']).to_csv('../dataset/urgency_dataset.csv', index=False)

# --- 3. Volunteer Matching Dataset (200+ rows) ---
skills = ['medical', 'rescue', 'transport', 'coordination', 'food distribution', 'general support']
availability_opt = ['weekdays', 'weekends', 'anytime']

data3 = []
for _ in range(250):
    need_cat = random.choice(categories)
    urgency = random.randint(1, 10)
    v_skills = random.choice(skills)
    avail = random.choice(availability_opt)
    dist = random.uniform(0, 50)
    
    # Match Logic
    score = 0
    if need_cat == v_skills: score += 5
    elif need_cat == 'food' and v_skills == 'food distribution': score += 5
    elif need_cat == 'logistics' and v_skills == 'transport': score += 5
    
    if avail == 'anytime': score += 3
    if dist < 10: score += 5
    elif dist < 25: score += 2
    
    score += (urgency / 2)
    
    label = 1 if score >= 8 else 0
    data3.append([need_cat, urgency, v_skills, avail, round(dist, 2), label])

pd.DataFrame(data3, columns=['needCategory', 'urgencyScore', 'volunteerSkills', 'availability', 'distanceKm', 'matchLabel']).to_csv('../dataset/matching_dataset.csv', index=False)

# --- 4. Region Priority Dataset (200+ rows) ---
data4 = []
for _ in range(250):
    lat = random.uniform(8, 37)
    lon = random.uniform(68, 97)
    urgency = random.randint(1, 10)
    needs = random.randint(1, 50)
    data4.append([round(lat, 4), round(lon, 4), urgency, needs])

pd.DataFrame(data4, columns=['latitude', 'longitude', 'urgencyScore', 'totalNeeds']).to_csv('../dataset/region_dataset.csv', index=False)

print("All datasets generated successfully in relieflink-ml/dataset/")
