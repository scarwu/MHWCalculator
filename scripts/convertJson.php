#!/usr/bin/env php
<?php

error_reporting(E_ALL);

$root = __DIR__;

function loadJson ($name) {
    $path = "{$root}/../json/{$name}.json";

    file_get_contents(json_decode($path, true));
}

function saveJson ($name) {
    $path = "{$root}/../src/assets/datasets/{$name}.json";

    file_get_contents(json_decode($path, true));
}

$weapons = [];
$weapons['greatSword/rare6'] = loadJson('weapons/greatSword/rare6');
$weapons['greatSword/rare7'] = loadJson('weapons/greatSword/rare7');
$weapons['greatSword/rare8'] = loadJson('weapons/greatSword/rare8');
$weapons['longSword/rare6'] = loadJson('weapons/longSword/rare6');
$weapons['longSword/rare7'] = loadJson('weapons/longSword/rare7');
$weapons['longSword/rare8'] = loadJson('weapons/longSword/rare8');
$weapons['swordAndShield/rare6'] = loadJson('weapons/swordAndShield/rare6');
$weapons['swordAndShield/rare7'] = loadJson('weapons/swordAndShield/rare7');
$weapons['swordAndShield/rare8'] = loadJson('weapons/swordAndShield/rare8');
$weapons['dualBlades/rare6'] = loadJson('weapons/dualBlades/rare6');
$weapons['dualBlades/rare7'] = loadJson('weapons/dualBlades/rare7');
$weapons['dualBlades/rare8'] = loadJson('weapons/dualBlades/rare8');
$weapons['hammer/rare6'] = loadJson('weapons/hammer/rare6');
$weapons['hammer/rare7'] = loadJson('weapons/hammer/rare7');
$weapons['hammer/rare8'] = loadJson('weapons/hammer/rare8');
$weapons['huntingHorn/rare6'] = loadJson('weapons/huntingHorn/rare6');
$weapons['huntingHorn/rare7'] = loadJson('weapons/huntingHorn/rare7');
$weapons['huntingHorn/rare8'] = loadJson('weapons/huntingHorn/rare8');
$weapons['lance/rare6'] = loadJson('weapons/lance/rare6');
$weapons['lance/rare7'] = loadJson('weapons/lance/rare7');
$weapons['lance/rare8'] = loadJson('weapons/lance/rare8');
$weapons['gunlance/rare6'] = loadJson('weapons/gunlance/rare6');
$weapons['gunlance/rare7'] = loadJson('weapons/gunlance/rare7');
$weapons['gunlance/rare8'] = loadJson('weapons/gunlance/rare8');
$weapons['switchAxe/rare6'] = loadJson('weapons/switchAxe/rare6');
$weapons['switchAxe/rare7'] = loadJson('weapons/switchAxe/rare7');
$weapons['switchAxe/rare8'] = loadJson('weapons/switchAxe/rare8');
$weapons['chargeBlade/rare6'] = loadJson('weapons/chargeBlade/rare6');
$weapons['chargeBlade/rare7'] = loadJson('weapons/chargeBlade/rare7');
$weapons['chargeBlade/rare8'] = loadJson('weapons/chargeBlade/rare8');
$weapons['insectGlaive/rare6'] = loadJson('weapons/insectGlaive/rare6');
$weapons['insectGlaive/rare7'] = loadJson('weapons/insectGlaive/rare7');
$weapons['insectGlaive/rare8'] = loadJson('weapons/insectGlaive/rare8');
$weapons['lightBowgun/rare6'] = loadJson('weapons/lightBowgun/rare6');
$weapons['lightBowgun/rare7'] = loadJson('weapons/lightBowgun/rare7');
$weapons['lightBowgun/rare8'] = loadJson('weapons/lightBowgun/rare8');
$weapons['heavyBowgun/rare6'] = loadJson('weapons/heavyBowgun/rare6');
$weapons['heavyBowgun/rare7'] = loadJson('weapons/heavyBowgun/rare7');
$weapons['heavyBowgun/rare8'] = loadJson('weapons/heavyBowgun/rare8');
$weapons['bow/rare6'] = loadJson('weapons/bow/rare6');
$weapons['bow/rare7'] = loadJson('weapons/bow/rare7');
$weapons['bow/rare8'] = loadJson('weapons/bow/rare8');
$armors = [];
$armors['rare5'] = loadJson('armors/rare5');
$armors['rare6'] = loadJson('armors/rare6');
$armors['rare7'] = loadJson('armors/rare7');
$armors['rare8'] = loadJson('armors/rare8');
$charms = loadJson('charms');
$jewels = loadJson('jewels');
$enhances = loadJson('enhances');
$skills = loadJson('skills');
$sets = loadJson('sets');
