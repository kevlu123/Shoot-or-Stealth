
class Particle
{
    static _particles = new SpriteList();

    static getSprites()
    {
        return Particle._particles;
    }

    static create(imageView, lifetime)
    {
        let particle = new PhysicsSprite();
        particle.setImageView(imageView);
        particle.setCircularHitbox();
        particle._endTime = lifetime + time;
        Particle._particles.push(particle);
        return particle;
    }

    static update()
    {
        let copy = new SpriteList();
        copy.push(...Particle._particles);

        for (let particle of copy)
        {
            particle.update();
            if (time >= particle._endTime)
                particle.destroy();
        }
    }
}

// Creates a single burst of sprites
class BurstParticle
{
    static create(imageView, x, y, count, vel, lifetime, minAngle=0, maxAngle=2 * Math.PI)
    {
        let particles = new SpriteList();

        for (let i = 0; i < count; i++)
        {
            let particle = Particle.create(imageView, lifetime);

            particle.useGravity = true;
            particle.x = x;
            particle.y = y;
            let dir = randFloat(minAngle, maxAngle);
            particle.velX = vel * Math.cos(dir);
            particle.velY = vel * Math.sin(dir);
            particle.angularVel = randFloat(0, BURST_PARTICLE_ANGULAR_VEL_MAX);

            particles.push(particle);
        }

        return particles;
    }
}

class BloodBurstParticle extends BurstParticle
{
    static create(x, y, minAngle=0, maxAngle=2 * Math.PI)
    {
        let particles = BurstParticle.create(
            null,
            x,
            y,
            5,
            3,
            2,
            minAngle,
            maxAngle
        );

        for (let particle of particles)
        {
            let size = randInt(
                BLOOD_PARTICLE_MIN_SIZE,
                BLOOD_PARTICLE_MAX_SIZE_EXCL,
            );

            let imageView = ImageView.fromAtlas(
                OBJECT_ATLAS_FILENAME,
                ObjectAtlasIndex.BLOOD_PARTICLE,
                0,
                0,
                size,
                size
            );

            particle.angularVel = 0;
            particle.setImageView(imageView);
        }
    }
}
