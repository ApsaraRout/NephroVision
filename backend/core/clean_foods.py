from core.models import Food

def run():
    unique = set()
    for food in Food.objects.all():
        clean_name = food.name.split("_")[0].lower().strip()
        if clean_name in unique:
            food.delete()
        else:
            food.name = clean_name
            food.save()
            unique.add(clean_name)