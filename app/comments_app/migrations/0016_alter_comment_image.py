# Generated by Django 5.0.3 on 2024-05-20 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments_app', '0015_alter_comment_image_alter_comment_text_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
