from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import nano.models


class Migration(migrations.Migration):

    dependencies = [
        ('nano', '0002_nanofolder_nanofile_delete_nano'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='nanofile',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to=nano.models.thumbnail_upload_path),
        ),
        migrations.CreateModel(
            name='NanoInlineImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=nano.models.inline_image_upload_path)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='nano_images', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
